document.addEventListener("DOMContentLoaded", () => {
    const settingName = document.getElementById("setting-name");
    const settingEmail = document.getElementById("setting-email");
    const saveBtn = document.getElementById("save-settings");

    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
        if (user.fullName) settingName.value = user.fullName;
        if (user.email) settingEmail.value = user.email;
    }

    saveBtn.addEventListener("click", () => {
        const updated = { fullName: settingName.value, email: settingEmail.value };
        localStorage.setItem("currentUser", JSON.stringify(updated));
        alert("Настройки успешно сохранены!");
    });
});