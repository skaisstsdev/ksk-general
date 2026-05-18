export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request' })
  }

  // Максимум 10 сообщений в истории чтобы не тратить токены
  const trimmedMessages = messages.slice(-10)

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        system: `Du bist ein freundlicher Assistent von KSK Farmos — einem spezialisierten ambulanten Intensivpflegedienst in Nordhessen, Deutschland. Du hilfst Patienten, Angehörigen und Pflegekräften.

ÜBER KSK FARMOS:
- Gegründet 2013 von Viktor Beresnev in Volkmarsen
- Spezialisiert auf ambulante Intensivpflege: Beatmungspflege, Wachkoma, ALS, Querschnittslähmung, Schädel-Hirn-Trauma
- 2 Standorte: Zentrale Volkmarsen (Ehringer Weg 2b) und Aufenthaltskonzept Kassel (Sommerbergstraße 14)
- Durchschnittlich 5,5 Mitarbeiter pro Patient — 24/7 Betreuung
- Versorgung in ganz Hessen
- Kostenübernahme durch Kranken- und Pflegekasse in der Regel vollständig
- Telefon Volkmarsen: 05693 / 9189907
- Telefon Kassel: 0170 / 7652593
- E-Mail: pflege@ksk-farmos.de
- Website: ksk-farmos.de
- Pflegedienstleitung: Olga Korp
- Ca. 30 Mitarbeiter im Team

AUFENTHALTSKONZEPT KASSEL:
- Eigene Zimmer mit individueller Einrichtung
- Garten, Bibliothek, Gemeinschaftsräume
- 24h-Betreuung durch examinierte Fachkräfte

KARRIERE:
- Übertarifliche Bezahlung
- Firmenwagen auch privat nutzbar
- Bezahlte Weiterbildungen durch Fachärzte
- 30 Tage Urlaub
- Schnellbewerbung unter ksk-farmos.de/schnellbewerbung.html

DEINE AUFGABE:
- Beantworte Fragen zu Leistungen, Kosten, Standorten, Karriere
- Erkläre dass die Krankenkasse die Kosten übernimmt
- Empfehle bei konkretem Bedarf die kostenlose Erstberatung
- Sei empathisch — viele Nutzer sind in schwierigen Situationen
- Antworte in der Sprache des Nutzers (Deutsch, Russisch, Englisch, Türkisch etc.)
- Halte Antworten kurz und klar — maximal 3-4 Sätze
- Wenn du etwas nicht weißt — sage es ehrlich und empfehle direkt anzurufen
- Gib NIEMALS medizinische Diagnosen oder Behandlungsempfehlungen

WICHTIG: Du bist kein Ersatz für das persönliche Gespräch. Bei dringendem Bedarf immer auf die Telefonnummer hinweisen.`,
        messages: trimmedMessages
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Claude API error:', data)
      return res.status(500).json({ error: 'API error' })
    }

    const text = data.content[0]?.text || ''
    return res.status(200).json({ message: text })

  } catch (error) {
    console.error('Server error:', error)
    return res.status(500).json({ error: 'Server error' })
  }
}
