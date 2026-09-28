require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// SAVE APPLICATION
app.post("/submit-application", async (req, res) => {

    try {
        const application = req.body;

        if (!application.name || !application.mobile) {
            return res.status(400).json({
                success: false,
                message: "Name aur mobile number required hai."
            });
        }

        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_SECRET_KEY;

        if (!url || !key) {
            throw new Error("Supabase environment variables missing");
        }

        const response = await fetch(
            ${url}/rest/v1/applications,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": key,
                    "Authorization": Bearer ${key},
                    "Prefer": "return=minimal"
                },
                body: JSON.stringify({
                    data: application
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        res.json({
            success: true,
            message: "Application successfully save ho gaya."
        });

    } catch (error) {

        console.log("APPLICATION ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Application save nahi hua."
        });
    }
});

// GET APPLICATIONS
app.get("/applications", async (req, res) => {

    try {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_SECRET_KEY;

        if (!url || !key) {
            throw new Error("Supabase environment variables missing");
        }

        const response = await fetch(
            ${url}/rest/v1/applications?select=*&order=created_at.desc,
            {
                headers: {
                    "apikey": key,
                    "Authorization": Bearer ${key}
                }
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const data = await response.json();

        const applications = data.map((row) => ({
            id: row.id,
            date: row.created_at,
            ...(row.data || {})
        }));

        res.json(applications);

    } catch (error) {

        console.log("APPLICATIONS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Applications load nahi hui."
        });
    }
});

if (process.env.VERCEL !== "1") {
    app.listen(PORT, () => {
        console.log("RELIANCE FINANCE SERVER RUNNING");
    });
}

module.exports = app;