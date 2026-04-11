const video = document.getElementById("video");

const THRESHOLD = 0.18;

let done = false;
let canvas;

// ================= LOAD MODELS =================
Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri("./models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
]).then(() => {
  console.log("Models loaded");
  startVideo();
});

// ================= START CAMERA =================
function startVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: {} })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((err) => console.error("Camera error:", err));
}

// ================= LABELS =================
async function getLabels() {
  return ["person1", "person2"];
}

// ================= NORMALIZE =================
function normalize(desc) {
  let sum = 0;
  for (let i = 0; i < desc.length; i++) sum += desc[i] * desc[i];
  const norm = Math.sqrt(sum);
  return desc.map((v) => v / norm);
}

// ================= LOAD TRAINING IMAGES =================
async function loadLabeledImages() {
  const labels = await getLabels();

  return Promise.all(
    labels.map(async (label) => {
      const descriptors = [];
      let i = 1;

      while (true) {
        try {
          const img = await faceapi.fetchImage(`./Images/${label}/${i}.jpg`);

          const detection = await faceapi
            .detectSingleFace(img, new faceapi.SsdMobilenetv1Options())
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (detection) descriptors.push(detection.descriptor);

          i++;
        } catch {
          break;
        }
      }

      const avg = new Float32Array(128).fill(0);

      descriptors.forEach((d) => {
        for (let i = 0; i < 128; i++) avg[i] += d[i];
      });

      for (let i = 0; i < 128; i++) {
        avg[i] /= descriptors.length;
      }

      return {
        label,
        descriptor: normalize(avg),
      };
    }),
  );
}

// ================= MATCH FUNCTION =================
function matchFace(descriptor, people) {
  descriptor = normalize(descriptor);

  let best = "unknown";
  let minDist = Infinity;

  const all = [];

  for (const p of people) {
    const dist = faceapi.euclideanDistance(descriptor, p.descriptor);

    all.push({ person: p.label, dist });

    if (dist < minDist) {
      minDist = dist;
      best = p.label;
    }
  }

  if (minDist <= THRESHOLD) {
    return {
      match: true,
      person: best,
      distance: minDist,
      all,
    };
  }

  return {
    match: false,
    person: "unknown",
    distance: minDist,
    all,
  };
}

// ================= STOP EVERYTHING =================
function stopAll(result) {
  const stream = video.srcObject;
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
  video.srcObject = null;

  if (canvas) {
    canvas.remove();
  }

  alert(
    `MATCH: ${result.match ? "YES" : "NO"}\n` +
      `PERSON: ${result.person}\n` +
      `DISTANCE: ${result.distance.toFixed(3)}\n` +
      `THRESHOLD: ${THRESHOLD}`,
  );

  console.log("ALL DISTANCES:");
  result.all.forEach((d) => console.log(`${d.person} => ${d.dist.toFixed(3)}`));

  console.log("Camera stopped + canvas removed");
}

// ================= MAIN =================
video.addEventListener("loadedmetadata", () => {
  video.play().then(startRecognition);
});

async function startRecognition() {
  if (done) return;
  done = true;

  const people = await loadLabeledImages();

  canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);

  const displaySize = {
    width: video.videoWidth,
    height: video.videoHeight,
  };

  faceapi.matchDimensions(canvas, displaySize);

  const interval = setInterval(async () => {
    if (video.readyState < 3) return;

    const detections = await faceapi
      .detectAllFaces(
        video,
        new faceapi.SsdMobilenetv1Options({ minConfidence: 0.6 }),
      )
      .withFaceLandmarks()
      .withFaceDescriptors();

    const resized = faceapi.resizeResults(detections, displaySize);

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (resized.length > 0) {
      const result = matchFace(resized[0].descriptor, people);

      new faceapi.draw.DrawBox(resized[0].detection.box, {
        label: `${result.match ? "YES" : "NO"} | ${result.person} | ${result.distance.toFixed(2)}`,
      }).draw(canvas);

      clearInterval(interval);
      stopAll(result);
    }
  }, 200);
}
