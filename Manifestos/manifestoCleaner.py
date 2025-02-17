import re

# Read the manifesto file
file_path = "C:/Users/mtuma/Manifesto-Summarisation-Project/Manifestos/UUPManifesto.txt"

with open(file_path, "r", encoding="utf-8") as file:
    text = file.read()

# Replace newlines that do NOT follow a full stop, exclamation mark, or question mark
formatted_text = re.sub(r"(?<![.!?])\n", " ", text)

# Write the cleaned text back to a file
output_path = "C:/Users/mtuma/Manifesto-Summarisation-Project/Manifestos/CleanedManifesto.txt"
with open(output_path, "w", encoding="utf-8") as file:
    file.write(formatted_text)

