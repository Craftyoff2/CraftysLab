// Default state
let themeEnabled = true;

// Handle banner upload
document.getElementById("bannerUpload").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById("banner").style.backgroundImage = `url(${e.target.result})`;
    };
    reader.readAsDataURL(file);
  }
});

// Handle avatar upload
document.getElementById("avatarUpload").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById("avatar").src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Handle username input
document.getElementById("usernameInput").addEventListener("input", function(event) {
  document.getElementById("username").textContent = event.target.value || "Crafty";
});

// Handle bio input
document.getElementById("bioInput").addEventListener("input", function(event) {
  document.getElementById("bio").textContent = event.target.value || "Ineedalittleroomtobreathe...";
});

// Handle theme color pickers
document.getElementById("primaryColor").addEventListener("input", function(e) {
  if (themeEnabled) {
    document.documentElement.style.setProperty("--primary-color", e.target.value);
  }
});
document.getElementById("accentColor").addEventListener("input", function(e) {
  if (themeEnabled) {
    document.documentElement.style.setProperty("--accent-color", e.target.value);
  }
});

// Toggle theme
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

// Timer (activity duration)
let seconds = 0;
function updateTimer() {
  seconds++;
  let mins = Math.floor(seconds / 60);
  let secs = seconds % 60;
  document.getElementById("timer").textContent = `${mins}:${secs.toString().padStart(2, "0")}`;
}
setInterval(updateTimer, 1000);