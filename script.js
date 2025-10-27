document.addEventListener('DOMContentLoaded', () => {
    const logFile = 'job_applications_log.csv';
    const jobTableBody = document.querySelector('#jobTable tbody');
    const statusFilter = document.getElementById('statusFilter');
    let allJobs = [];

    // Function to fetch and parse the CSV file
    async function loadCSV() {
        try {
            const response = await fetch(logFile);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const csvText = await response.text();
            allJobs = parseCSV(csvText);
            displayJobs(allJobs);
        } catch (error) {
            console.error('Could not load job log:', error);
            jobTableBody.innerHTML = `<tr><td colspan="7">Error loading data. Make sure <code>job_applications_log.csv</code> is in the correct location.</td></tr>`;
        }
    }

    // Simple CSV parser
    function parseCSV(csv) {
        const lines = csv.trim().split('\n');
        if (lines.length === 0) return [];

        // Simple split by comma, ignoring potential quotes for now
        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index].trim();
                });
                data.push(row);
            }
        }
        return data;
    }

    // Function to display jobs in the table
    function displayJobs(jobs) {
        jobTableBody.innerHTML = ''; // Clear existing rows
        const filterValue = statusFilter.value;

        const filteredJobs = jobs.filter(job => {
            return filterValue === '' || job.Status === filterValue;
        });

        if (filteredJobs.length === 0) {
            jobTableBody.innerHTML = `<tr><td colspan="7">No applications found with status: ${filterValue}</td></tr>`;
            return;
        }

        filteredJobs.forEach(job => {
            const row = jobTableBody.insertRow();
            
            // Add status class to the row for coloring
            row.classList.add(`status-${job.Status}`);

            // Columns: Title, Company, Salary, Source, Applied Date, Status, Link
            row.insertCell().textContent = job.Title;
            row.insertCell().textContent = job.Company;
            row.insertCell().textContent = job.Salary;
            row.insertCell().textContent = job.Source;
            row.insertCell().textContent = job.Applied_Date;
            row.insertCell().textContent = job.Status;
            
            // Link column
            const linkCell = row.insertCell();
            const linkAnchor = document.createElement('a');
            linkAnchor.href = job.Link;
            linkAnchor.textContent = 'View Job';
            linkAnchor.target = '_blank';
            linkCell.appendChild(linkAnchor);
        });
    }

    // Event listener for the filter
    statusFilter.addEventListener('change', () => {
        displayJobs(allJobs);
    });

    // Initial load
    loadCSV();
});
