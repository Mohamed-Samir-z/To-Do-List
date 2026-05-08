document.getElementById('authForm').onsubmit = function (e) {
    e.preventDefault();
    const email = document.getElementById('userEmail').value;
    const pass = document.getElementById('userPass').value;
    const feedback = document.getElementById('feedback');

    if (!email.endsWith('@azhar.adu.eg')) {
        feedback.innerHTML = " Email must end with @azhar.adu.eg❌";
        feedback.style.cssText ="color:red; font-weight:bold ; Justify-content: center; display: flex; align-items: center;";

    } else if (pass.length < 8) {
        feedback.innerHTML = " Password must be at least 8 characters❌";
        feedback.style.cssText =
        "color:red; font-weight:bold ; Justify-content: center; display: flex; align-items: center;";
    } else {
        feedback.innerHTML = " Success! Mohamed Mabrouk will contact you soon.✅";
        feedback.style.cssText =
        "color:green; font-weight:bold ; Justify-content: center; display: flex; align-items: center;";
    }
};