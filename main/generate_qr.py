
import qrcode

# Temporary test URL. Replace with your actual portfolio link.
website_url = "https://example.com"

qr = qrcode.make(website_url)
qr.save("portfolio_qr.png")

print("QR code saved successfully!")
print("Location: portfolio_qr.png")
