// Default state
let themeEnabled = true;

// ---------- Banner & Avatar Upload ----------
document.getElementById("bannerButton").addEventListener("click", () => {
  document.getElementById("bannerUpload").click();
});
document.getElementById("avatarButton").addEventListener("click", () => {
  document.getElementById("avatarUpload").click();
});

document.getElementById("bannerUpload").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById("banner").style.backgroundImage = `url(${e.target.result})`;
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById("avatarUpload").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => document.getElementById("avatar").src = e.target.result;
    reader.readAsDataURL(file);
  }
});

// ---------- Username & Bio ----------
document.getElementById("usernameInput").addEventListener("input", function(event) {
  document.getElementById("username").textContent = event.target.value || "Crafty";
});
document.getElementById("bioInput").addEventListener("input", function(event) {
  document.getElementById("bio").textContent = event.target.value || "Ineedalittleroomtobreathe...";
});

// ---------- Theme Color ----------
document.getElementById("primaryColor").addEventListener("input", function(e) {
  if (themeEnabled) document.documentElement.style.setProperty("--primary-color", e.target.value);
});
document.getElementById("accentColor").addEventListener("input", function(e) {
  if (themeEnabled) document.documentElement.style.setProperty("--accent-color", e.target.value);
});
document.getElementById("toggleTheme").addEventListener("click", function() {
  themeEnabled = !themeEnabled;
  if (!themeEnabled) {
    document.documentElement.style.removeProperty("--primary-color");
    document.documentElement.style.removeProperty("--accent-color");
  } else {
    document.documentElement.style.setProperty("--primary-color", document.getElementById("primaryColor").value);
    document.documentElement.style.setProperty("--accent-color", document.getElementById("accentColor").value);
  }
});

// ---------- Timer ----------
let seconds = 0;
function updateTimer() {
  seconds++;
  let mins = Math.floor(seconds / 60);
  let secs = seconds % 60;
  document.getElementById("timer").textContent = `${mins}:${secs.toString().padStart(2,"0")}`;
}
setInterval(updateTimer, 1000);

// ---------- Link Toggle ----------
document.getElementById("toggleLink").addEventListener("click", () => {
  const link = document.getElementById("profileLink");
  link.style.display = link.style.display === "none" ? "inline" : "none";
});

// ---------- Badges ----------
const badgeCheckboxes = document.querySelectorAll(".badge-checkbox");

badgeCheckboxes.forEach(checkbox => {
  checkbox.addEventListener("change", () => {
    const display = document.getElementById("displayBadges");
    const badgeName = checkbox.dataset.badge;

    // Remove existing badge if unchecked
    const existingBadge = document.getElementById(`badge-${badgeName}`);
    if (!checkbox.checked && existingBadge) {
      existingBadge.remove();
      return;
    }

    // Determine image source
    let imgSrc = `badges/${badgeName}.png`;

    if (badgeName === "nitro") {
      const version = checkbox.parentElement.querySelector(".nitro-select").value;
      imgSrc = `badges/nitro_${version}.png`;
    } else if (badgeName === "server_boost") {
      const version = checkbox.parentElement.querySelector(".serverboost-select").value;
      imgSrc = `badges/server_boost_${version}.png`;
    } else if (badgeName === "bug_hunter") {
      const version = checkbox.parentElement.querySelector(".bughunter-select").value;
      imgSrc = `badges/bug_hunter_${version}.png`;
    } else if (badgeName === "hypesquad") {
      const version = checkbox.parentElement.querySelector(".hypesquad-select").value;
      imgSrc = `badges/hypesquad_${version}.png`;
    }

    // Add badge if checked
    if (checkbox.checked && !existingBadge) {
      const img = document.createElement("img");
      img.id = `badge-${badgeName}`;
      img.className = "badge";

      // Ensure large images scale down
      img.style.width = "25px";
      img.style.height = "25px";
      img.style.objectFit = "contain";

      // Fallback if image not found
      img.onerror = () => {
        img.src = "badges/missing.png"; // optional: generic missing badge
      };

      img.src = imgSrc;
      display.appendChild(img);
    }
  });
});

// ---------- Nitro Select Update ----------
const nitroSelects = document.querySelectorAll(".nitro-select");
nitroSelects.forEach(select => {
  select.addEventListener("change", () => {
    const badge = document.getElementById("badge-nitro");
    if (badge) {
      const version = select.value;
      badge.src = `badges/nitro_${version}.png`;
      badge.style.width = "25px";
      badge.style.height = "25px";
    }
  });
});

// ---------- Server Boost Select Update ----------
const serverBoostSelects = document.querySelectorAll(".serverboost-select");
serverBoostSelects.forEach(select => {
  select.addEventListener("change", () => {
    const badge = document.getElementById("badge-server_boost");
    if (badge) {
      const version = select.value;
      badge.src = `badges/server_boost_${version}.png`;
      badge.style.width = "25px";
      badge.style.height = "25px";
    }
  });
});

// ---------- Bug Hunter Select Update ----------
const bugHunterSelects = document.querySelectorAll(".bughunter-select");
bugHunterSelects.forEach(select => {
  select.addEventListener("change", () => {
    const badge = document.getElementById("badge-bug_hunter");
    if (badge) {
      const version = select.value;
      badge.src = `badges/bug_hunter_${version}.png`;
      badge.style.width = "25px";
      badge.style.height = "25px";
    }
  });
});

// ---------- HypeSquad Select Update ----------
const hypeSquadSelects = document.querySelectorAll(".hypesquad-select");
hypeSquadSelects.forEach(select => {
  select.addEventListener("change", () => {
    const badge = document.getElementById("badge-hypesquad");
    if (badge) {
      const version = select.value;
      badge.src = `badges/hypesquad_${version}.png`;
      badge.style.width = "25px";
      badge.style.height = "25px";
    }
  });
});
