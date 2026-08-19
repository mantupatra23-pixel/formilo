from PIL import Image
import os

img = Image.open('public/logo.png')
# High quality resize (128x128 is perfect for Navbar)
img = img.resize((128, 128), Image.Resampling.LANCZOS)
img.save('public/logo.png', 'PNG')
print("Logo resized to 128x128 successfully.")
