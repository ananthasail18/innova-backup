import os
import re

directory = r"c:\Users\anant\Desktop\projects\innov hack\frontend\src"
pattern = re.compile(r"\b(sm|md|lg|xl|2xl):")

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith((".tsx", ".ts")) and file != "Layout.tsx":
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Use negative lookbehind to ensure we don't double replace if @ is already there
            new_content = re.sub(r"(?<!@)\b(sm|md|lg|xl|2xl):", r"@\1:", content)
            
            if new_content != content:
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
