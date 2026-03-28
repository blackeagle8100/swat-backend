import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8100;
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("SWAT backend draait.");
});

app.post("/api/contact-discord", async (req, res) => {
    const { subject, name, phone, email, message } = req.body;

    try {
        const discordResponse = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                embeds: [
                    {
                        title: "📩 Nieuw websitebericht",
                        color: 5763719,
                        fields: [
                            {
                                name: "Onderwerp",
                                value: subject || "Niet opgegeven",
                                inline: false
                            },
                            {
                                name: "Naam",
                                value: name || "Niet opgegeven",
                                inline: true
                            },
                            {
                                name: "Telefoon",
                                value: phone || "Niet opgegeven",
                                inline: true
                            },
                            {
                                name: "E-mail",
                                value: email || "Niet opgegeven",
                                inline: false
                            }
                        ],
                        description: message || "Geen bericht opgegeven",
                        footer: {
                            text: "Verzonden via SWAT contactformulier"
                        },
                        timestamp: new Date().toISOString()
                    }
                ]
            })
        });

        if (!discordResponse.ok) {
            throw new Error(`Discord webhook fout: ${discordResponse.status}`);
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Fout bij verzenden naar Discord:", error);
        res.status(500).json({ success: false });
    }
});

app.listen(PORT, () => {
    console.log(`Server draait op poort ${PORT}`);
});
