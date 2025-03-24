document.getElementById('itineraryForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {};
    formData.forEach((value, key) => data[key] = value);

    const fromDate = new Date(data["fromDate"]);
    const toDate = new Date(data["toDate"]);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      const output = document.getElementById("result");
      output.innerHTML = '<p>Error: Invalid dates provided</p>';
      return;
    }

    if (toDate < fromDate) {
      const output = document.getElementById("result");
      output.innerHTML = '<p>Error: To date must be after from date</p>';
      return;
    }

    const formatDate = d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const addDays = days => new Date(fromDate.getTime() + days * 86400000);

      // Format the two main fields as well
    data["fromDate"] = formatDate(fromDate);
    data["toDate"] = formatDate(toDate);

    data["arrivalDate"] = formatDate(addDays(0));
    data["PHfromDate"]  = formatDate(addDays(0));
    data["PHtoDate"]    = formatDate(addDays(2));
    data["transfer_2"]  = formatDate(addDays(2));
    data["PPfromDate"]  = formatDate(addDays(2));
    data["PPtoDate"]    = formatDate(addDays(4));
    data["transfer_3"]  = formatDate(addDays(4));
    data["PLfromDate"]  = formatDate(addDays(4));
    data["PLtoDate"]    = formatDate(addDays(8));
    data["transfer_4"]  = formatDate(addDays(8));
    data["KBfromDate"]  = formatDate(addDays(8));
    data["KBtoDate"]    = formatDate(addDays(12));
    data["transfer_5"]  = formatDate(addDays(12));

    const response = await fetch('/api/generate', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data })
    });
    
    const result = await response.json();
    const output = document.getElementById("result");
    
    if (result.status === 200 && result.data) {
      output.innerHTML = `
        <p>${result.message}</p>
        <a href="${result.data}" target="_blank" download>Download Itinerary (PDF)</a>
      `;
    } else {
      output.innerHTML = `<p>Error: ${result.message || 'Unknown error'}</p>`;
    }
  });

  
  