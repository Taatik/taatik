---
title: "Transliterate"
draft: false
type: "page"
# js is stored in /assets
js: "transliterate.js"
---

<div class="text-container">
    <label for="input">Hebrew:</label>
    <textarea id="input" rows="4" class="text-box" dir="rtl" placeholder="שָׁלֹום הָעֹלָם!"></textarea>
</div>

<div class="control-container">
    <div class="selection-container">
        <select name="methods" id="methods">
            <option value="none" selected disabled hidden>Choose a language...</option>
            <option value="umschrift">German</option>
            <option value="metagraphi">Greek</option>
        </select>
    </div>
    <div class="btn-container">
        <button class='button' id='btn'>Transliterate</button>
    </div>

</div>

<div class="text-container">
    <label for="output">Transliteration:</label>
    <textarea id="output" rows="4" class="text-box" placeholder="Hello World!"></textarea>
</div>
