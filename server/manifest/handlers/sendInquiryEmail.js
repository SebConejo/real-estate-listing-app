const mailgun = require('mailgun-js')

module.exports = async (req, res, manifest) => {
  const { name, email, message, residence: residenceId } = req.body

  const residence = await manifest
    .from('residences')
    .with(['agent'])
    .findOneById(req.body.residence)

  if (!residence || !residence.agent) {
    throw new Error('Résidence ou agent introuvable')
  }

  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  })

  const data = {
    from: `Contact Immo <noreply@${process.env.MAILGUN_DOMAIN}>`,
    to: residence.agent.email,
    subject: `Nouveau contact pour la résidence #${residence.id}`,
    text: `Nom: ${name}\nEmail: ${email}\nMessage: ${message}\nRésidence: ${residence.title}`,
  }

  try {
    const emailResponse = await mg.messages().send(data)
    req.body.emailStatus = emailResponse
  } catch (err) {
    throw new Error("Erreur lors de l'envoi de l'email : " + err.message)
  }
}
