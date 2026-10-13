document.addEventListener("DOMContentLoaded", () => {
    const authForm = document.getElementById("auth-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const demoBypass = document.getElementById("demo-bypass");

    if (demoBypass) {
        demoBypass.addEventListener("click", (e) => {
      
            localStorage.setItem("currentUser", JSON.stringify({ fullName: "Sarah Connor", email: "sarah@launch.com" }));
        });
    }

    if (authForm) {
        authForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            try {
                const res = await fetch("data/users.json");
                const data = await res.json();
                const user = data.users.find(u => u.email === emailInput.value.trim());
                if (user || emailInput.value) {
                    localStorage.setItem("currentUser", JSON.stringify(user || { email: emailInput.value }));
                    window.location.href = "dashboard.html";
                } else {
                    alert("User not found");
                }
            } catch (err) {
                
                localStorage.setItem("currentUser", JSON.stringify({ email: emailInput.value }));
                window.location.href = "dashboard.html";
            }
        });
    }
});