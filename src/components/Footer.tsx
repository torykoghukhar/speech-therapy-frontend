export default function Footer() {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>© 2026 SoundSteps – Платформа розвитку мовлення</p>
      <p style={styles.text}>Контакти: support@soundsteps.com</p>
    </footer>
  )
}

const styles = {
  footer: {
    padding: '16px',
    backgroundColor: '#0367bf',
    color: 'white',
    textAlign: 'center' as const,
  },
  text: {
    fontSize: '13px',
    margin: '4px 0',
    opacity: 0.9,
  },
}
