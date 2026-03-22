    function speak(textToSay) {
      const message = new SpeechSynthesisUtterance(textToSay);
      message.pitch = 1.2;
      message.rate = 1.0;
      window.speechSynthesis.speak(message);
    }

    function updateSelection() {
      // 1. Find the Menu and the Textarea by their IDs
      const menu = document.getElementById('wordSelector');
      const display = document.getElementById('showSentence');

      // 2. The Gatekeeper: Only run if they didn't pick "--Select--" (Index 0)
      if (menu.selectedIndex > 0) {

        // 3. Drill Down: Find the specific 'option' that was clicked
        const selectedOption = menu.options[menu.selectedIndex];

        // 4. Extract the hidden data-sentence
        const hiddenSentence = selectedOption.dataset.sentence;

        // 5. Put that sentence into the Textarea box
        display.value = hiddenSentence;

      } else {
        // If they go back to "--Select--", clear the box
        display.value = "";
      }
    }
    
    function speakContents(type) {
      let textToSay = "";

      if (type === 'word') {
        // Look in the Select Menu
        const menu = document.getElementById('wordSelector');
        if (menu.selectedIndex > 0) {
          textToSay = menu.options[menu.selectedIndex].text;
        }
      }
      else if (type === 'sentence') {
        // Look in the Textarea
        const display = document.getElementById('showSentence');
        textToSay = display.value;
      }

      // If we found something to say, send it to the engine!
      if (textToSay !== "") {
        speak(textToSay);
      }
    }