const MY_WHATSAPP_NUMBER = "923144005234"; 

const form = document.getElementById("intakeForm");
const body = document.body;
const loader = document.getElementById("loader");
const successBanner = document.getElementById("successMessage");
const canvas = document.getElementById("electricCanvas");
const ctx = canvas.getContext("2d");

window.addEventListener("load", () => {
  setTimeout(() => { loader.classList.add("hidden"); }, 1500); 
});

/* ⚡ ELECTRIC NEURAL NETWORK (Canvas Physics) ⚡ */
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

window.addEventListener("resize", () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

const particles = [];
const numParticles = 70; // Dots ki tadad
const maxDistance = 150; // Dots ke darmiyan line ki lambai

const mouse = { x: null, y: null, radius: 200 };

window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('touchmove', (e) => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; });
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });
window.addEventListener('touchend', () => { mouse.x = null; mouse.y = null; });

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;
    this.baseVx = this.vx;
    this.baseVy = this.vy;
    this.size = Math.random() * 2 + 1;
  }
  
  update(isError) {
    // Short Circuit speed 6X
    const speedMult = isError ? 6 : 1;

    // Mouse se door bhaagna (Repel)
    if (mouse.x != null) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < mouse.radius) {
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (mouse.radius - distance) / mouse.radius;
        const directionX = forceDirectionX * force * 5;
        const directionY = forceDirectionY * force * 5;
        
        this.x -= directionX;
        this.y -= directionY;
      }
    }

    this.x += this.vx * speedMult;
    this.y += this.vy * speedMult;

    // Screen boundaries
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw(isError) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = isError ? "rgba(255, 0, 60, 0.8)" : "rgba(0, 242, 254, 0.8)";
    ctx.fill();
  }
}

for (let i = 0; i < numParticles; i++) {
  particles.push(new Particle());
}

function animate() {
  const isError = body.classList.contains('fast-waves');
  
  // Background clear karein (trail effect ke liye alpha kam rakhein)
  ctx.fillStyle = isError ? "rgba(26, 0, 5, 0.2)" : "rgba(2, 5, 10, 0.2)";
  ctx.fillRect(0, 0, width, height);

  particles.forEach((p, index) => {
    p.update(isError);
    p.draw(isError);

    // Dots ke darmiyan lines (Neural Network)
    for (let j = index + 1; j < particles.length; j++) {
      let dx = p.x - particles[j].x;
      let dy = p.y - particles[j].y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        let opacity = 1 - (distance / maxDistance);
        
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(particles[j].x, particles[j].y);
        
        if (isError) {
           // Short circuit error lines (Red & chaotic)
           ctx.strokeStyle = `rgba(255, 0, 60, ${opacity})`;
           ctx.lineWidth = 1.5;
        } else {
           // Normal electric lines (Blue)
           ctx.strokeStyle = `rgba(0, 242, 254, ${opacity * 0.5})`;
           ctx.lineWidth = 0.5;
        }
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(animate);
}
animate();


/* FORM VALIDATION & SUBMIT */
document.querySelectorAll('.has-other').forEach(select => {
  select.addEventListener('change', function() {
    const otherInput = this.parentElement.querySelector('.other-input');
    if (this.value === 'Other') {
      otherInput.style.display = 'block';
      otherInput.setAttribute('required', 'required');
    } else {
      otherInput.style.display = 'none';
      otherInput.removeAttribute('required');
      otherInput.value = ''; 
    }
    validateField(this);
  });
});

const requiredInputs = form.querySelectorAll('[required]');
requiredInputs.forEach(input => {
  input.addEventListener('input', function() {
    if (this.value.trim() !== '') {
      this.classList.remove('invalid');
      this.parentElement.classList.remove('error-label');
      checkGlobalErrorState();
    }
  });
});

function validateField(field) {
  if (field.hasAttribute('required') && field.value.trim() === '') {
    field.classList.add('invalid');
    field.parentElement.classList.add('error-label');
    return false;
  } else {
    field.classList.remove('invalid');
    field.parentElement.classList.remove('error-label');
    return true;
  }
}

function checkGlobalErrorState() {
  const hasErrors = document.querySelectorAll('.invalid').length > 0;
  if (!hasErrors) {
    body.classList.remove('fast-waves'); 
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  
  let hasError = false;
  requiredInputs.forEach(input => {
    if (!validateField(input)) hasError = true;
  });

  if (hasError) {
    // 🚨 SHORT CIRCUIT TRIGGER 🚨
    body.classList.add('fast-waves'); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return; 
  }

  body.classList.remove('fast-waves');
  successBanner.classList.add("show");

  const data = new FormData(form);
  const clientName = data.get("client_name") || "Unknown";
  const clientNumber = data.get("client_whatsapp") || "No Number";

  let message = `*🤖 AI SYSTEM ALERT: NEW CLIENT*\n`;
  message += `👤 *Name:* ${clientName}\n`;
  message += `📱 *Client Number:* ${clientNumber}\n`;
  message += "━━━━━━━━━━━━━━━━━━\n";

  const sectionTitles = {
    company: "A. BASIC INFO", purpose: "B. PURPOSE & GOAL", roles: "C. RECRUITMENT",
    customer_type: "D. CUSTOMER SERVICE", recruitment_data: "E. KNOWLEDGE BASE",
    phone_system: "F. TECHNICAL SETUP", gdpr: "G. COMPLIANCE", budget_one_time: "H. BUDGET & TIMELINE",
  };

  const fieldLabels = {
    designation: "Designation", company: "Company", timing: "Office Timing", employees: "Employees",
    purpose: "Main Purpose", purpose_other: "Purpose (Other)", recruitment_problem: "Recruitment Problem",
    cs_problem: "CS Problem", success_metric: "Success Metric", roles: "Roles & Positions",
    must_have: "Must-have Skills", nice_to_have: "Nice-to-have Skills", experience: "Min Experience",
    degree: "Degree Requirement", degree_other: "Degree (Other)", portfolio_role: "Portfolio Role",
    portfolio_check: "Portfolio Check", cv_extract: "CV Extract", ai_reject: "AI Reject/Shortlist",
    ai_reject_other: "AI Reject (Other)", interview_schedule: "Interview Scheduling",
    interview_schedule_other: "Interview Schedule (Other)", shortlist_destination: "Shortlist Destination",
    auto_reply: "Auto-reply", auto_reply_other: "Auto-reply (Other)", customer_type: "Customer Type",
    faqs: "Top FAQs", ai_tasks: "AI Tasks", ai_not_do: "AI Should NOT Do", transfer_to: "Transfer To",
    channels: "Support Channels", recruitment_data: "Recruitment Data", cs_data: "CS Data",
    brand_tone: "Brand Tone", brand_tone_other: "Brand Tone (Other)", phone_system: "Phone System",
    ats: "ATS", calendar: "Calendar", customer_data: "Customer Data Dest", candidate_data: "Candidate Data Dest",
    website_api: "Website/WhatsApp API", cv_email: "CV Email", gdpr: "GDPR", gdpr_other: "GDPR (Other)",
    retention: "Data Retention", ai_disclosure: "AI Disclosure", call_recording: "Call Recording",
    call_recording_other: "Call Recording (Other)", ai_disclose: "AI Disclose", ai_disclose_other: "AI Disclose (Other)",
    budget_one_time: "One-time Budget", budget_monthly: "Monthly Budget", deadline: "Deadline",
    content_status: "Content Status", pilot: "Pilot Test", pilot_other: "Pilot Test (Other)",
  };

  let currentSection = "";
  for (const [key, value] of data.entries()) {
    if (key === "client_name" || key === "client_whatsapp") continue;
    if (!value || value.trim() === "") continue;

    if (value === "Other" && key in fieldLabels) {
        const otherKey = key + "_other";
        if (data.get(otherKey)) continue; 
    }

    if (sectionTitles[key]) {
      currentSection = sectionTitles[key];
      message += `\n*📌 ${currentSection}*\n`;
    }

    const label = fieldLabels[key] || key;
    message += `• *${label}:* ${value}\n`;
  }

  message += "\n━━━━━━━━━━━━━━━━━━\n";
  message += "✅ SYSTEM INITIALIZED";

  const encoded = encodeURIComponent(message);
  const waURL = `https://wa.me/${MY_WHATSAPP_NUMBER}?text=${encoded}`;

  setTimeout(() => {
    window.open(waURL, "_blank");
    setTimeout(() => { successBanner.classList.remove("show"); }, 3000);
  }, 1500);
});
