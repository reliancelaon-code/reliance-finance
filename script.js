document.addEventListener("DOMContentLoaded", function () {

    const loanModal = document.getElementById("loanModal");
    const closeBtn = document.getElementById("closeBtn");

    const applyBtn = document.getElementById("applyBtn");
    const heroApplyBtn = document.getElementById("heroApplyBtn");
    const bottomApplyBtn = document.getElementById("bottomApplyBtn");

    const loanForm = document.getElementById("loanForm");


    // OPEN FORM
    function openLoanForm() {
        if (loanModal) {
            loanModal.style.display = "flex";
            document.body.style.overflow = "hidden";
        }
    }

    if (applyBtn) {
        applyBtn.addEventListener("click", openLoanForm);
    }

    if (heroApplyBtn) {
        heroApplyBtn.addEventListener("click", openLoanForm);
    }

    if (bottomApplyBtn) {
        bottomApplyBtn.addEventListener("click", openLoanForm);
    }


    // CLOSE FORM
    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            loanModal.style.display = "none";
            document.body.style.overflow = "auto";
        });
    }


    // CLOSE OUTSIDE
    if (loanModal) {
        loanModal.addEventListener("click", function (event) {
            if (event.target === loanModal) {
                loanModal.style.display = "none";
                document.body.style.overflow = "auto";
            }
        });
    }


    // SUBMIT FORM
    if (loanForm) {

        loanForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const application = {
                name: document.getElementById("name").value.trim(),
                loanAmount: document.getElementById("loanAmount").value,
                mobile: document.getElementById("mobile").value.trim(),
                email: document.getElementById("email").value.trim(),
                state: document.getElementById("state").value,
                loanType: document.getElementById("loanType").value,
                monthlyIncome: document.getElementById("monthlyIncome").value
            };


            if (!application.name) {
                alert("Please enter your name.");
                return;
            }

            if (!/^[0-9]{10}$/.test(application.mobile)) {
                alert("Please enter a valid 10-digit mobile number.");
                return;
            }

            if (!application.email) {
                alert("Please enter your email.");
                return;
            }

            if (!application.loanAmount) {
                alert("Please enter loan amount.");
                return;
            }


            try {

                const response = await fetch("/submit-application", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(application)
                });

                const result = await response.json();

                if (result.success) {

                    alert("Application successfully submitted!");

                    loanForm.reset();

                    loanModal.style.display = "none";
                    document.body.style.overflow = "auto";

                } else {

                    alert(result.message);

                }

            } catch (error) {

                console.error(error);

                alert("Server se connection nahi ho raha.");

            }

        });
    }

});