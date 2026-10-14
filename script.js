// InnovaTech Pro - Interactive Form Validation (demo only)
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const status = document.getElementById("status");
  const names = ["name", "email", "phone", "password", "confirm"];
  const inputs = Object.fromEntries(names.map(n => [n, document.getElementById(n)]));
  const errors = Object.fromEntries(names.map(n => [n, document.getElementById(n + "Error")]));
  const toggle = document.getElementById("togglePassword");
  const strengthText = document.getElementById("strengthText");
  const bars = [...document.querySelectorAll(".strength span")];

  function rules(p) {
    return {
      length: p.length >= 8,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      number: /\d/.test(p),
      symbol: /[^A-Za-z0-9]/.test(p)
    };
  }

  function updateStrength() {
    const password = inputs.password.value;
    const checks = rules(password);
    document.querySelectorAll("[data-rule]").forEach(li => {
      li.classList.toggle("met", checks[li.dataset.rule] === true);
    });
    const count = Object.values(checks).filter(Boolean).length;
    const level = !password ? 0 : count <= 1 ? 1 : count === 2 ? 2 : count <= 4 ? 3 : 4;
    const labels = ["Not entered", "Weak", "Fair", "Good", "Strong"];
    const colors = ["", "weak", "fair", "good", "strong"];
    strengthText.textContent = "Password strength: " + labels[level];
    bars.forEach((bar, i) => bar.className = i < level ? colors[level] : "");
  }

  function errorFor(name) {
    const value = inputs[name].value.trim();
    switch(name) {
      case "name":
        if (!value) return "Full name is required.";
        if (value.length < 3) return "Enter at least 3 characters.";
        return "";
      case "email":
        if (!value) return "Email is required.";
        if (value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
        return "";
      case "phone":
        if (!value) return "Phone number is required.";
        if (!/^07\d{8}$/.test(value)) return "Enter a valid 10-digit Sri Lankan mobile number.";
        return "";
      case "password":
        if (!inputs.password.value) return "Password is required.";
        if (!Object.values(rules(inputs.password.value)).every(Boolean)) return "Meet all five password requirements.";
        return "";
      case "confirm":
        if (!inputs.confirm.value) return "Confirm your password.";
        if (inputs.confirm.value !== inputs.password.value) return "Passwords do not match.";
        return "";
      default: return "";
    }
  }

  function validate(name) {
    const err = errorFor(name);
    const input = inputs[name];
    const group = input.closest(".field");
    errors[name].textContent = err;
    group.classList.toggle("invalid", !!err);
    group.classList.toggle("valid", !err);
    input.setAttribute("aria-invalid", String(!!err));
    return !err;
  }

  for (const name of names) {
    const input = inputs[name];
    input.addEventListener("focus", () => input.closest(".field").classList.add("focused"));
    input.addEventListener("blur", () => {
      input.closest(".field").classList.remove("focused");
      input.dataset.touched = "yes";
      validate(name);
    });
    input.addEventListener("input", () => {
      status.textContent = "";
      status.className = "status";
      if (name === "password") {
        updateStrength();
        if (inputs.confirm.dataset.touched === "yes") validate("confirm");
      }
      if (input.dataset.touched === "yes" || input.value.length > 0) validate(name);
    });
  }

  toggle.addEventListener("click", () => {
    const visible = inputs.password.type === "password";
    inputs.password.type = visible ? "text" : "password";
    toggle.textContent = visible ? "Hide" : "Show";
    toggle.setAttribute("aria-pressed", String(visible));
    toggle.setAttribute("aria-label", visible ? "Hide password" : "Show password");
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    let firstInvalid = null;
    for (const name of names) {
      inputs[name].dataset.touched = "yes";
      if (!validate(name) && !firstInvalid) firstInvalid = inputs[name];
    }
    if (firstInvalid) {
      status.textContent = "Please correct the highlighted fields.";
      status.className = "status failure";
      firstInvalid.focus();
      return;
    }
    // No form data is submitted, logged, or stored.
    form.reset();
    for (const name of names) {
      const input = inputs[name];
      delete input.dataset.touched;
      input.setAttribute("aria-invalid", "false");
      input.closest(".field").classList.remove("valid", "invalid", "focused");
      errors[name].textContent = "";
    }
    inputs.password.type = "password";
    toggle.textContent = "Show";
    toggle.setAttribute("aria-pressed", "false");
    toggle.setAttribute("aria-label", "Show password");
    updateStrength();
    status.textContent = "Validation successful! Demo only — no account created.";
    status.className = "status success";
  });

  updateStrength();
});
