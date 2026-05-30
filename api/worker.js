export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://snap-sum.com",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (url.pathname === "/api/pdf-to-word" && request.method === "POST") {
      return handlePdfToWord(request, env, corsHeaders);
    }

    return Response.json({ error: "Not found" }, { status: 404, headers: corsHeaders });
  },
};

async function handlePdfToWord(request, env, corsHeaders) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400, headers: corsHeaders });
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return Response.json({ error: "Only PDF files are accepted" }, { status: 400, headers: corsHeaders });
    }

    if (file.size > 50 * 1024 * 1024) {
      return Response.json({ error: "File exceeds 50MB limit" }, { status: 400, headers: corsHeaders });
    }

    // Step 1: Create upload task
    const importRes = await fetch("https://api.cloudconvert.com/v2/import/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.CLOUDCONVERT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filename: file.name }),
    });

    if (!importRes.ok) {
      const err = await importRes.text();
      return Response.json({ error: "Upload task failed", details: err }, { status: 500, headers: corsHeaders });
    }

    const importData = await importRes.json();
    const uploadUrl = importData.data.result.form.url;
    const uploadParams = importData.data.result.form.parameters;
    const taskId = importData.data.id;

    // Step 2: Upload file to CloudConvert
    const uploadForm = new FormData();
    for (const [key, value] of Object.entries(uploadParams)) {
      uploadForm.append(key, value);
    }
    uploadForm.append("file", file);

    const uploadRes = await fetch(uploadUrl, { method: "POST", body: uploadForm });
    if (!uploadRes.ok) {
      return Response.json({ error: "File upload failed" }, { status: 500, headers: corsHeaders });
    }

    // Step 3: Create conversion task
    const convertRes = await fetch("https://api.cloudconvert.com/v2/convert", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.CLOUDCONVERT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: taskId,
        input_format: "pdf",
        output_format: "docx",
        engine: "cloudconvert",
      }),
    });

    if (!convertRes.ok) {
      const err = await convertRes.text();
      return Response.json({ error: "Convert task failed", details: err }, { status: 500, headers: corsHeaders });
    }

    const convertData = await convertRes.json();
    const convertTaskId = convertData.data.id;

    // Step 4: Poll for completion (max 120s)
    let result = null;
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 2000));

      const statusRes = await fetch(`https://api.cloudconvert.com/v2/tasks/${convertTaskId}`, {
        headers: { Authorization: `Bearer ${env.CLOUDCONVERT_API_KEY}` },
      });

      const statusData = await statusRes.json();
      const status = statusData.data.status;

      if (status === "finished") {
        result = statusData.data.result;
        break;
      }
      if (status === "error") {
        return Response.json(
          { error: "Conversion failed", details: statusData.data.message },
          { status: 500, headers: corsHeaders }
        );
      }
    }

    if (!result) {
      return Response.json({ error: "Conversion timeout" }, { status: 504, headers: corsHeaders });
    }

    // Step 5: Return CloudConvert download URL directly
    return Response.json(
      {
        success: true,
        downloadUrl: result.url,
        filename: file.name.replace(".pdf", ".docx"),
      },
      { headers: corsHeaders }
    );
  } catch (err) {
    return Response.json(
      { error: "Internal server error", details: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
