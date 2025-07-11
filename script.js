// Sistema de Controle de Horas Trabalhadas
// Automated time tracking system with weekly calculations

class TimesheetManager {
    constructor() {
        this.weekdays = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
        this.fullDayValue = 50.00;
        this.halfDayValue = 25.00;
        this.currentWeekDates = [];
        this.currentMonth = '';
        this.currentWeekNumber = 1;
        
        this.initialize();
    }

    initialize() {
        this.generateCurrentWeekDates();
        this.calculateWeekNumber();
        this.detectCurrentMonth();
        this.renderTimesheet();
        this.updateWeekDisplay();
        this.attachEventListeners();
        this.loadSavedData();
        this.setupWeeklyAutoUpdate();
    }

    // Generate dates for current week (Monday to Sunday)
    generateCurrentWeekDates() {
        const today = new Date();
        const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        
        // Calculate Monday of current week
        const monday = new Date(today);
        const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay;
        monday.setDate(today.getDate() + daysToMonday);
        
        this.currentWeekDates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            this.currentWeekDates.push(date);
        }
    }

    // Calculate current week number using ISO 8601 standard
    calculateWeekNumber() {
        const monday = this.currentWeekDates[0]; // Monday of current week
        this.currentWeekNumber = this.getISOWeekNumber(monday);
    }

    // Get ISO 8601 week number
    getISOWeekNumber(date) {
        // Create copy of date to avoid modifying original
        const d = new Date(date);
        
        // Set to Thursday of the current week (ISO 8601 week determination)
        d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
        
        // Get the year of the Thursday
        const year = d.getFullYear();
        
        // Get January 4th of the same year (always in week 1)
        const jan4 = new Date(year, 0, 4);
        
        // Calculate the Thursday of week 1
        const week1Thursday = new Date(jan4);
        week1Thursday.setDate(jan4.getDate() + 3 - ((jan4.getDay() + 6) % 7));
        
        // Calculate week number
        const weekNumber = Math.floor((d.getTime() - week1Thursday.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
        
        return weekNumber;
    }

    // Test and display current week information (for debugging)
    displayWeekInfo() {
        const today = new Date();
        const monday = this.currentWeekDates[0];
        const year = monday.getFullYear();
        
        console.log(`Informações da Semana Atual (ISO 8601):`);
        console.log(`Data de hoje: ${today.toLocaleDateString('pt-BR')}`);
        console.log(`Segunda-feira desta semana: ${monday.toLocaleDateString('pt-BR')}`);
        console.log(`Ano: ${year}`);
        console.log(`Mês: ${this.currentMonth}`);
        console.log(`Número da semana ISO 8601: ${this.currentWeekNumber}`);
        console.log(`Formato ISO: ${year}-W${this.currentWeekNumber.toString().padStart(2, '0')}`);
        
        // Test with some reference dates
        const testDates = [
            new Date(2025, 0, 1),  // 1º de janeiro de 2025
            new Date(2025, 0, 6),  // 6 de janeiro de 2025
            new Date(2025, 6, 11), // 11 de julho de 2025 (hoje)
            new Date(2025, 11, 31) // 31 de dezembro de 2025
        ];
        
        console.log('\nTeste com datas de referência:');
        testDates.forEach(date => {
            const weekNum = this.getISOWeekNumber(date);
            const year = date.getFullYear();
            console.log(`${date.toLocaleDateString('pt-BR')}: Semana ${weekNum} de ${year}`);
        });
    }

    // Detect current month
    detectCurrentMonth() {
        const today = new Date();
        const months = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        this.currentMonth = months[today.getMonth()];
    }

    // Setup automatic weekly update
    setupWeeklyAutoUpdate() {
        // Check for week update every hour
        setInterval(() => {
            this.checkForWeekUpdate();
        }, 60 * 60 * 1000); // 1 hour in milliseconds
        
        // Also check immediately when page loads
        this.checkForWeekUpdate();
    }

    // Check if we need to update to a new week
    checkForWeekUpdate() {
        const today = new Date();
        const currentMonday = new Date(today);
        const currentDay = today.getDay();
        const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay;
        currentMonday.setDate(today.getDate() + daysToMonday);
        
        // Compare with stored week
        const storedMonday = this.currentWeekDates[0];
        
        if (currentMonday.toDateString() !== storedMonday.toDateString()) {
            // New week detected - update everything
            this.generateCurrentWeekDates();
            this.calculateWeekNumber();
            this.detectCurrentMonth();
            this.renderTimesheet();
            this.updateWeekDisplay();
            this.loadSavedData();
            
            // Show notification about new week
            const year = this.currentWeekDates[0].getFullYear();
            this.showSuccessMessage(`🗓️ Nova semana iniciada! Semana ${this.currentWeekNumber} de ${year} (ISO 8601)`);
        }
    }

    // Format date to Brazilian format (dd/mm/yyyy)
    formatDate(date) {
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    // Format currency to Brazilian Real
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    // Generate timesheet table rows
    renderTimesheet() {
        const tbody = document.getElementById('timesheet-body');
        tbody.innerHTML = '';

        this.currentWeekDates.forEach((date, index) => {
            const row = document.createElement('tr');
            const dateStr = this.formatDate(date);
            const dayName = this.weekdays[index];
            const dateKey = date.toISOString().split('T')[0];

            row.innerHTML = `
                <td class="fw-bold">${dateStr}</td>
                <td>${dayName}</td>
                <td class="text-center">
                    <div class="form-check form-check-inline">
                        <input class="form-check-input full-day-checkbox" type="checkbox" 
                               id="full-${index}" data-date="${dateKey}">
                        <label class="form-check-label" for="full-${index}">
                            <i class="fas fa-sun text-warning"></i>
                        </label>
                    </div>
                </td>
                <td class="text-center">
                    <div class="form-check form-check-inline">
                        <input class="form-check-input half-day-checkbox" type="checkbox" 
                               id="half-${index}" data-date="${dateKey}">
                        <label class="form-check-label" for="half-${index}">
                            <i class="fas fa-clock text-info"></i>
                        </label>
                    </div>
                </td>
                <td class="fw-bold daily-value" data-date="${dateKey}">
                    ${this.formatCurrency(0)}
                </td>
            `;

            tbody.appendChild(row);
        });
    }

    // Update week display in header
    updateWeekDisplay() {
        const firstDate = this.formatDate(this.currentWeekDates[0]);
        const lastDate = this.formatDate(this.currentWeekDates[6]);
        document.getElementById('current-week').textContent = `${firstDate} - ${lastDate}`;
        
        // Update month and week number display
        const monthWeekDisplay = document.getElementById('month-week-display');
        if (monthWeekDisplay) {
            const year = this.currentWeekDates[0].getFullYear();
            monthWeekDisplay.textContent = `${this.currentMonth} ${year} - Semana ${this.currentWeekNumber} (ISO 8601)`;
        }
    }

    // Attach event listeners to checkboxes
    attachEventListeners() {
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('full-day-checkbox') || 
                e.target.classList.contains('half-day-checkbox')) {
                this.handleCheckboxChange(e.target);
            }
        });
    }

    // Handle checkbox state changes
    handleCheckboxChange(checkbox) {
        const dateKey = checkbox.getAttribute('data-date');
        const isFullDay = checkbox.classList.contains('full-day-checkbox');
        const isHalfDay = checkbox.classList.contains('half-day-checkbox');

        // Get both checkboxes for this date
        const fullDayBox = document.querySelector(`input[data-date="${dateKey}"].full-day-checkbox`);
        const halfDayBox = document.querySelector(`input[data-date="${dateKey}"].half-day-checkbox`);

        // Business logic: Full day takes precedence
        if (isFullDay && checkbox.checked) {
            halfDayBox.checked = false;
        } else if (isHalfDay && checkbox.checked && fullDayBox.checked) {
            // If trying to check half day while full day is checked, prevent it
            checkbox.checked = false;
            return;
        }

        // Calculate and update daily value
        this.updateDailyValue(dateKey);
        this.updateTotals();
        this.saveData();
    }

    // Calculate and update daily value for a specific date
    updateDailyValue(dateKey) {
        const fullDayBox = document.querySelector(`input[data-date="${dateKey}"].full-day-checkbox`);
        const halfDayBox = document.querySelector(`input[data-date="${dateKey}"].half-day-checkbox`);
        const valueCell = document.querySelector(`td[data-date="${dateKey}"].daily-value`);

        let value = 0;
        
        if (fullDayBox.checked) {
            value = this.fullDayValue;
            valueCell.className = 'fw-bold daily-value table-success';
        } else if (halfDayBox.checked) {
            value = this.halfDayValue;
            valueCell.className = 'fw-bold daily-value table-warning';
        } else {
            valueCell.className = 'fw-bold daily-value';
        }

        valueCell.textContent = this.formatCurrency(value);
    }

    // Update all totals and summary
    updateTotals() {
        let totalValue = 0;
        let fullDaysCount = 0;
        let halfDaysCount = 0;

        // Calculate totals
        this.currentWeekDates.forEach(date => {
            const dateKey = date.toISOString().split('T')[0];
            const fullDayBox = document.querySelector(`input[data-date="${dateKey}"].full-day-checkbox`);
            const halfDayBox = document.querySelector(`input[data-date="${dateKey}"].half-day-checkbox`);

            if (fullDayBox.checked) {
                totalValue += this.fullDayValue;
                fullDaysCount++;
            } else if (halfDayBox.checked) {
                totalValue += this.halfDayValue;
                halfDaysCount++;
            }
        });

        // Update UI
        document.getElementById('weekly-total').textContent = this.formatCurrency(totalValue);
        document.getElementById('full-days-count').textContent = fullDaysCount;
        document.getElementById('half-days-count').textContent = halfDaysCount;
        document.getElementById('total-value').textContent = this.formatCurrency(totalValue);
    }

    // Save data to database
    async saveData() {
        try {
            const weekStart = this.currentWeekDates[0].toISOString().split('T')[0];
            const weekEnd = this.currentWeekDates[4].toISOString().split('T')[0];
            
            // Save individual entries
            for (let i = 0; i < this.currentWeekDates.length; i++) {
                const date = this.currentWeekDates[i];
                const dateKey = date.toISOString().split('T')[0];
                const fullDayBox = document.querySelector(`input[data-date="${dateKey}"].full-day-checkbox`);
                const halfDayBox = document.querySelector(`input[data-date="${dateKey}"].half-day-checkbox`);
                
                let dailyValue = 0;
                if (fullDayBox.checked) {
                    dailyValue = this.fullDayValue;
                } else if (halfDayBox.checked) {
                    dailyValue = this.halfDayValue;
                }

                await fetch('/api/timesheet', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        date: dateKey,
                        dayOfWeek: this.weekdays[i],
                        fullDay: fullDayBox.checked,
                        halfDay: halfDayBox.checked,
                        dailyValue: dailyValue
                    })
                });
            }

            // Save weekly summary
            const fullDaysCount = parseInt(document.getElementById('full-days-count').textContent);
            const halfDaysCount = parseInt(document.getElementById('half-days-count').textContent);
            const totalValue = this.calculateTotalValue();

            await fetch('/api/summary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    weekStart,
                    weekEnd,
                    fullDaysCount,
                    halfDaysCount,
                    totalValue
                })
            });
        } catch (error) {
            console.error('Error saving data:', error);
            // Fallback to localStorage if API fails
            this.saveDataToLocalStorage();
        }
    }

    // Helper method to calculate total value
    calculateTotalValue() {
        let totalValue = 0;
        this.currentWeekDates.forEach(date => {
            const dateKey = date.toISOString().split('T')[0];
            const fullDayBox = document.querySelector(`input[data-date="${dateKey}"].full-day-checkbox`);
            const halfDayBox = document.querySelector(`input[data-date="${dateKey}"].half-day-checkbox`);

            if (fullDayBox.checked) {
                totalValue += this.fullDayValue;
            } else if (halfDayBox.checked) {
                totalValue += this.halfDayValue;
            }
        });
        return totalValue;
    }

    // Fallback method for localStorage
    saveDataToLocalStorage() {
        const data = {
            weekStart: this.currentWeekDates[0].toISOString(),
            entries: {}
        };

        this.currentWeekDates.forEach(date => {
            const dateKey = date.toISOString().split('T')[0];
            const fullDayBox = document.querySelector(`input[data-date="${dateKey}"].full-day-checkbox`);
            const halfDayBox = document.querySelector(`input[data-date="${dateKey}"].half-day-checkbox`);

            data.entries[dateKey] = {
                fullDay: fullDayBox.checked,
                halfDay: halfDayBox.checked
            };
        });

        localStorage.setItem('timesheetData', JSON.stringify(data));
    }

    // Load saved data from database
    async loadSavedData() {
        try {
            const weekStart = this.currentWeekDates[0].toISOString().split('T')[0];
            const weekEnd = this.currentWeekDates[4].toISOString().split('T')[0];
            
            // Load timesheet entries
            const response = await fetch(`/api/timesheet/${weekStart}/${weekEnd}`);
            if (response.ok) {
                const entries = await response.json();
                
                // Apply loaded data to checkboxes
                entries.forEach(entry => {
                    const fullDayBox = document.querySelector(`input[data-date="${entry.date}"].full-day-checkbox`);
                    const halfDayBox = document.querySelector(`input[data-date="${entry.date}"].half-day-checkbox`);

                    if (fullDayBox && halfDayBox) {
                        fullDayBox.checked = entry.full_day;
                        halfDayBox.checked = entry.half_day;
                        this.updateDailyValue(entry.date);
                    }
                });

                this.updateTotals();
            }
        } catch (error) {
            console.error('Error loading saved data from database:', error);
            // Fallback to localStorage
            this.loadDataFromLocalStorage();
        }
    }

    // Fallback method for localStorage
    loadDataFromLocalStorage() {
        const savedData = localStorage.getItem('timesheetData');
        if (!savedData) return;

        try {
            const data = JSON.parse(savedData);
            const savedWeekStart = new Date(data.weekStart);
            const currentWeekStart = this.currentWeekDates[0];

            // Only load data if it's for the current week
            if (savedWeekStart.toDateString() === currentWeekStart.toDateString()) {
                Object.entries(data.entries).forEach(([dateKey, entry]) => {
                    const fullDayBox = document.querySelector(`input[data-date="${dateKey}"].full-day-checkbox`);
                    const halfDayBox = document.querySelector(`input[data-date="${dateKey}"].half-day-checkbox`);

                    if (fullDayBox && halfDayBox) {
                        fullDayBox.checked = entry.fullDay;
                        halfDayBox.checked = entry.halfDay;
                        this.updateDailyValue(dateKey);
                    }
                });

                this.updateTotals();
            }
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }

    // Reset all checkboxes and values
    resetWeek() {
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });

        this.currentWeekDates.forEach(date => {
            const dateKey = date.toISOString().split('T')[0];
            this.updateDailyValue(dateKey);
        });

        this.updateTotals();
        this.saveData();
    }

    // Export data in multiple formats
    exportData() {
        // Show export options modal
        this.showExportModal();
    }

    // Show export options modal
    showExportModal() {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'exportModal';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-download"></i>
                            Exportar Dados da Semana
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p class="text-muted">
                            Semana: ${this.formatDate(this.currentWeekDates[0])} - ${this.formatDate(this.currentWeekDates[6])}
                        </p>
                        <p class="text-muted">
                            <i class="fas fa-calendar-alt"></i>
                            ${this.currentMonth} ${this.currentWeekDates[0].getFullYear()} - Semana ${this.currentWeekNumber} (ISO 8601)
                        </p>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <button class="btn btn-primary w-100" onclick="timesheetManager.exportAsJSON()">
                                    <i class="fas fa-file-code"></i>
                                    Exportar como JSON
                                </button>
                                <small class="text-muted">Formato estruturado para sistemas</small>
                            </div>
                            <div class="col-md-6 mb-3">
                                <button class="btn btn-success w-100" onclick="timesheetManager.exportAsCSV()">
                                    <i class="fas fa-file-csv"></i>
                                    Exportar como CSV
                                </button>
                                <small class="text-muted">Compatível com Excel e Planilhas</small>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <button class="btn btn-info w-100" onclick="timesheetManager.exportAsHTML()">
                                    <i class="fas fa-file-alt"></i>
                                    Exportar como HTML
                                </button>
                                <small class="text-muted">Relatório formatado para impressão</small>
                            </div>
                            <div class="col-md-6 mb-3">
                                <button class="btn btn-warning w-100" onclick="timesheetManager.exportAsTXT()">
                                    <i class="fas fa-file-text"></i>
                                    Exportar como TXT
                                </button>
                                <small class="text-muted">Texto simples universal</small>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <button class="btn btn-danger w-100" onclick="timesheetManager.exportAsPDF()">
                                    <i class="fas fa-file-pdf"></i>
                                    Exportar como PDF
                                </button>
                                <small class="text-muted">Documento profissional com logotipo</small>
                            </div>
                            <div class="col-md-6 mb-3">
                                <button class="btn btn-secondary w-100" onclick="timesheetManager.exportAsPNG()">
                                    <i class="fas fa-image"></i>
                                    Exportar como PNG
                                </button>
                                <small class="text-muted">Imagem de alta qualidade</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
        
        // Remove modal from DOM when closed
        modal.addEventListener('hidden.bs.modal', () => {
            document.body.removeChild(modal);
        });
    }

    // Export as JSON
    exportAsJSON() {
        const data = {
            sistema: "Sistema de Controle de Horas Trabalhadas",
            dataExportacao: new Date().toLocaleString('pt-BR'),
            semana: {
                inicio: this.formatDate(this.currentWeekDates[0]),
                fim: this.formatDate(this.currentWeekDates[4])
            },
            diasTrabalho: [],
            resumo: {
                diasCompletos: parseInt(document.getElementById('full-days-count').textContent),
                meiosPeriodos: parseInt(document.getElementById('half-days-count').textContent),
                valorTotal: document.getElementById('total-value').textContent
            }
        };

        this.currentWeekDates.forEach((date, index) => {
            const dateKey = date.toISOString().split('T')[0];
            const fullDayBox = document.querySelector(`input[data-date="${dateKey}"].full-day-checkbox`);
            const halfDayBox = document.querySelector(`input[data-date="${dateKey}"].half-day-checkbox`);
            const valueCell = document.querySelector(`td[data-date="${dateKey}"].daily-value`);

            data.diasTrabalho.push({
                data: this.formatDate(date),
                diaSemana: this.weekdays[index],
                diaCompleto: fullDayBox.checked,
                meioPeriodo: halfDayBox.checked,
                valorDia: valueCell.textContent
            });
        });

        this.downloadFile(JSON.stringify(data, null, 2), 'application/json', 'json');
        bootstrap.Modal.getInstance(document.getElementById('exportModal')).hide();
    }

    // Export as CSV
    exportAsCSV() {
        let csvContent = 'Data,Dia da Semana,Dia Completo,Meio Período,Valor do Dia\n';
        
        this.currentWeekDates.forEach((date, index) => {
            const dateKey = date.toISOString().split('T')[0];
            const fullDayBox = document.querySelector(`input[data-date="${dateKey}"].full-day-checkbox`);
            const halfDayBox = document.querySelector(`input[data-date="${dateKey}"].half-day-checkbox`);
            const valueCell = document.querySelector(`td[data-date="${dateKey}"].daily-value`);

            csvContent += `${this.formatDate(date)},${this.weekdays[index]},${fullDayBox.checked ? 'Sim' : 'Não'},${halfDayBox.checked ? 'Sim' : 'Não'},${valueCell.textContent}\n`;
        });

        // Add summary
        csvContent += '\nResumo da Semana:\n';
        csvContent += `Dias Completos,${document.getElementById('full-days-count').textContent}\n`;
        csvContent += `Meios Períodos,${document.getElementById('half-days-count').textContent}\n`;
        csvContent += `Valor Total,${document.getElementById('total-value').textContent}\n`;

        this.downloadFile(csvContent, 'text/csv', 'csv');
        bootstrap.Modal.getInstance(document.getElementById('exportModal')).hide();
    }

    // Export as HTML
    exportAsHTML() {
        const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Horas Trabalhadas</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .period { font-size: 18px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f2f2f2; }
        .summary { background-color: #f9f9f9; padding: 15px; margin-top: 20px; }
        .total { font-size: 20px; font-weight: bold; color: #28a745; }
        .print-date { font-size: 12px; color: #666; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Sistema de Controle de Horas Trabalhadas</h1>
        <p class="period">Semana: ${this.formatDate(this.currentWeekDates[0])} - ${this.formatDate(this.currentWeekDates[6])}</p>
        <p class="period">${this.currentMonth} ${this.currentWeekDates[0].getFullYear()} - Semana ${this.currentWeekNumber} (ISO 8601)</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Data</th>
                <th>Dia da Semana</th>
                <th>Dia Completo</th>
                <th>Meio Período</th>
                <th>Valor do Dia</th>
            </tr>
        </thead>
        <tbody>
            ${this.currentWeekDates.map((date, index) => {
                const dateKey = date.toISOString().split('T')[0];
                const fullDayBox = document.querySelector(`input[data-date="${dateKey}"].full-day-checkbox`);
                const halfDayBox = document.querySelector(`input[data-date="${dateKey}"].half-day-checkbox`);
                const valueCell = document.querySelector(`td[data-date="${dateKey}"].daily-value`);
                
                return `
                    <tr>
                        <td>${this.formatDate(date)}</td>
                        <td>${this.weekdays[index]}</td>
                        <td>${fullDayBox.checked ? '✓' : '—'}</td>
                        <td>${halfDayBox.checked ? '✓' : '—'}</td>
                        <td>${valueCell.textContent}</td>
                    </tr>
                `;
            }).join('')}
        </tbody>
    </table>

    <div class="summary">
        <h3>Resumo da Semana</h3>
        <p><strong>Dias Completos:</strong> ${document.getElementById('full-days-count').textContent}</p>
        <p><strong>Meios Períodos:</strong> ${document.getElementById('half-days-count').textContent}</p>
        <p class="total"><strong>Valor Total:</strong> ${document.getElementById('total-value').textContent}</p>
    </div>

    <p class="print-date">Relatório gerado em: ${new Date().toLocaleString('pt-BR')}</p>
</body>
</html>
        `;

        this.downloadFile(htmlContent, 'text/html', 'html');
        bootstrap.Modal.getInstance(document.getElementById('exportModal')).hide();
    }

    // Export as TXT
    exportAsTXT() {
        let txtContent = '=== SISTEMA DE CONTROLE DE HORAS TRABALHADAS ===\n\n';
        txtContent += `Semana: ${this.formatDate(this.currentWeekDates[0])} - ${this.formatDate(this.currentWeekDates[6])}\n`;
        const year = this.currentWeekDates[0].getFullYear();
        txtContent += `${this.currentMonth} ${year} - Semana ${this.currentWeekNumber} (ISO 8601)\n`;
        txtContent += `Relatório gerado em: ${new Date().toLocaleString('pt-BR')}\n\n`;
        
        txtContent += 'DIAS TRABALHADOS:\n';
        txtContent += '─'.repeat(60) + '\n';
        
        this.currentWeekDates.forEach((date, index) => {
            const dateKey = date.toISOString().split('T')[0];
            const fullDayBox = document.querySelector(`input[data-date="${dateKey}"].full-day-checkbox`);
            const halfDayBox = document.querySelector(`input[data-date="${dateKey}"].half-day-checkbox`);
            const valueCell = document.querySelector(`td[data-date="${dateKey}"].daily-value`);

            txtContent += `${this.formatDate(date)} - ${this.weekdays[index]}\n`;
            txtContent += `  Dia Completo: ${fullDayBox.checked ? 'Sim' : 'Não'}\n`;
            txtContent += `  Meio Período: ${halfDayBox.checked ? 'Sim' : 'Não'}\n`;
            txtContent += `  Valor: ${valueCell.textContent}\n\n`;
        });

        txtContent += 'RESUMO DA SEMANA:\n';
        txtContent += '─'.repeat(60) + '\n';
        txtContent += `Dias Completos: ${document.getElementById('full-days-count').textContent}\n`;
        txtContent += `Meios Períodos: ${document.getElementById('half-days-count').textContent}\n`;
        txtContent += `VALOR TOTAL: ${document.getElementById('total-value').textContent}\n`;

        this.downloadFile(txtContent, 'text/plain', 'txt');
        bootstrap.Modal.getInstance(document.getElementById('exportModal')).hide();
    }

    // Create professional logo SVG
    createCompanyLogo() {
        return `
            <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#0d6efd;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#0a58ca;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <circle cx="40" cy="40" r="35" fill="url(#logoGradient)" stroke="#ffffff" stroke-width="2"/>
                <g fill="white">
                    <circle cx="40" cy="25" r="2"/>
                    <circle cx="40" cy="40" r="2"/>
                    <circle cx="40" cy="55" r="2"/>
                    <path d="M25 20 L55 20 L55 25 L25 25 Z"/>
                    <path d="M25 35 L55 35 L55 40 L25 40 Z"/>
                    <path d="M25 50 L55 50 L55 55 L25 55 Z"/>
                    <path d="M20 15 L20 65 L25 65 L25 15 Z"/>
                    <path d="M55 15 L55 65 L60 65 L60 15 Z"/>
                </g>
                <text x="40" y="72" text-anchor="middle" fill="#0d6efd" font-family="Arial, sans-serif" font-size="8" font-weight="bold">WORK</text>
            </svg>
        `;
    }

    // Create document template for exports
    createDocumentTemplate() {
        const logoSvg = this.createCompanyLogo();
        const totalValue = this.calculateTotalValue();
        const fullDaysCount = document.getElementById('full-days-count').textContent;
        const halfDaysCount = document.getElementById('half-days-count').textContent;
        
        return `
            <div id="export-document" style="
                width: 800px;
                margin: 0 auto;
                padding: 40px;
                font-family: 'Arial', sans-serif;
                background: white;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
                border-radius: 10px;
            ">
                <div style="text-align: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 3px solid #0d6efd;">
                    <div style="display: inline-block; margin-bottom: 20px;">
                        ${logoSvg}
                    </div>
                    <h1 style="color: #0d6efd; margin: 15px 0; font-size: 28px; font-weight: bold;">
                        RELATÓRIO DE HORAS TRABALHADAS
                    </h1>
                    <div style="background: linear-gradient(135deg, #0d6efd, #0a58ca); color: white; padding: 10px 20px; border-radius: 20px; display: inline-block; font-size: 16px; font-weight: bold;">
                        Semana: ${this.formatDate(this.currentWeekDates[0])} - ${this.formatDate(this.currentWeekDates[6])}
                    </div>
                    <div style="margin-top: 10px; color: #0d6efd; font-weight: bold; font-size: 18px;">
                        ${this.currentMonth} ${this.currentWeekDates[0].getFullYear()} - Semana ${this.currentWeekNumber} (ISO 8601)
                    </div>
                </div>
                
                <div style="margin-bottom: 40px;">
                    <h2 style="color: #0d6efd; border-bottom: 2px solid #e9ecef; padding-bottom: 10px; margin-bottom: 20px;">
                        📅 Detalhamento Diário
                    </h2>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <thead>
                            <tr style="background: linear-gradient(135deg, #0d6efd, #0a58ca); color: white;">
                                <th style="padding: 15px; text-align: left; font-weight: bold;">Data</th>
                                <th style="padding: 15px; text-align: left; font-weight: bold;">Dia da Semana</th>
                                <th style="padding: 15px; text-align: center; font-weight: bold;">Dia Completo</th>
                                <th style="padding: 15px; text-align: center; font-weight: bold;">Meio Período</th>
                                <th style="padding: 15px; text-align: right; font-weight: bold;">Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.currentWeekDates.map((date, index) => {
                                const dateKey = date.toISOString().split('T')[0];
                                const fullDayBox = document.querySelector(`input[data-date="${dateKey}"].full-day-checkbox`);
                                const halfDayBox = document.querySelector(`input[data-date="${dateKey}"].half-day-checkbox`);
                                const valueCell = document.querySelector(`td[data-date="${dateKey}"].daily-value`);
                                const isEven = index % 2 === 0;
                                
                                return `
                                    <tr style="background: ${isEven ? '#f8f9fa' : 'white'}; border-bottom: 1px solid #e9ecef;">
                                        <td style="padding: 12px; font-weight: bold;">${this.formatDate(date)}</td>
                                        <td style="padding: 12px;">${this.weekdays[index]}</td>
                                        <td style="padding: 12px; text-align: center;">
                                            <span style="display: inline-block; width: 20px; height: 20px; border-radius: 50%; background: ${fullDayBox.checked ? '#28a745' : '#dc3545'}; color: white; text-align: center; line-height: 20px; font-size: 12px;">
                                                ${fullDayBox.checked ? '✓' : '✗'}
                                            </span>
                                        </td>
                                        <td style="padding: 12px; text-align: center;">
                                            <span style="display: inline-block; width: 20px; height: 20px; border-radius: 50%; background: ${halfDayBox.checked ? '#28a745' : '#dc3545'}; color: white; text-align: center; line-height: 20px; font-size: 12px;">
                                                ${halfDayBox.checked ? '✓' : '✗'}
                                            </span>
                                        </td>
                                        <td style="padding: 12px; text-align: right; font-weight: bold; color: #28a745;">${valueCell.textContent}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 30px; border-radius: 15px; margin-bottom: 30px;">
                    <h2 style="color: #0d6efd; text-align: center; margin-bottom: 25px; font-size: 24px;">
                        📊 Resumo da Semana
                    </h2>
                    <div style="display: flex; justify-content: space-around; align-items: center; flex-wrap: wrap;">
                        <div style="text-align: center; margin: 10px;">
                            <div style="background: #0d6efd; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin: 0 auto 10px;">
                                ${fullDaysCount}
                            </div>
                            <div style="font-weight: bold; color: #495057;">Dias Completos</div>
                        </div>
                        <div style="text-align: center; margin: 10px;">
                            <div style="background: #6c757d; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin: 0 auto 10px;">
                                ${halfDaysCount}
                            </div>
                            <div style="font-weight: bold; color: #495057;">Meios Períodos</div>
                        </div>
                        <div style="text-align: center; margin: 10px;">
                            <div style="background: #28a745; color: white; padding: 15px 25px; border-radius: 25px; font-size: 28px; font-weight: bold;">
                                ${this.formatCurrency(totalValue)}
                            </div>
                            <div style="font-weight: bold; color: #495057; margin-top: 10px;">Valor Total</div>
                        </div>
                    </div>
                </div>
                
                <div style="text-align: center; color: #6c757d; font-size: 14px; border-top: 1px solid #e9ecef; padding-top: 20px;">
                    <p style="margin: 5px 0;">
                        <strong>Relatório gerado em:</strong> ${new Date().toLocaleString('pt-BR')}
                    </p>
                    <p style="margin: 5px 0;">
                        <strong>Sistema de Controle de Horas Trabalhadas</strong>
                    </p>
                    <p style="margin: 5px 0; font-style: italic;">
                        Este documento foi gerado automaticamente pelo sistema
                    </p>
                </div>
            </div>
        `;
    }

    // Export as PDF
    async exportAsPDF() {
        try {
            const { jsPDF } = window.jspdf;
            
            // Create temporary document
            const template = this.createDocumentTemplate();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = template;
            tempDiv.style.position = 'absolute';
            tempDiv.style.top = '-9999px';
            tempDiv.style.left = '-9999px';
            document.body.appendChild(tempDiv);
            
            // Convert to canvas
            const canvas = await html2canvas(tempDiv.querySelector('#export-document'), {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff'
            });
            
            // Create PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');
            
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            
            let position = 0;
            
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            // Download PDF
            const weekStart = this.currentWeekDates[0].toISOString().split('T')[0];
            const filename = `relatorio_horas_${weekStart}.pdf`;
            pdf.save(filename);
            
            // Clean up
            document.body.removeChild(tempDiv);
            bootstrap.Modal.getInstance(document.getElementById('exportModal')).hide();
            this.showSuccessMessage(`Relatório PDF ${filename} gerado com sucesso!`);
            
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            this.showSuccessMessage('Erro ao gerar PDF. Tente novamente.');
        }
    }

    // Export as PNG
    async exportAsPNG() {
        try {
            // Create temporary document
            const template = this.createDocumentTemplate();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = template;
            tempDiv.style.position = 'absolute';
            tempDiv.style.top = '-9999px';
            tempDiv.style.left = '-9999px';
            document.body.appendChild(tempDiv);
            
            // Convert to canvas
            const canvas = await html2canvas(tempDiv.querySelector('#export-document'), {
                scale: 3,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff'
            });
            
            // Convert to blob and download
            canvas.toBlob((blob) => {
                const weekStart = this.currentWeekDates[0].toISOString().split('T')[0];
                const filename = `relatorio_horas_${weekStart}.png`;
                
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                // Clean up
                document.body.removeChild(tempDiv);
                bootstrap.Modal.getInstance(document.getElementById('exportModal')).hide();
                this.showSuccessMessage(`Imagem PNG ${filename} gerada com sucesso!`);
            }, 'image/png');
            
        } catch (error) {
            console.error('Erro ao gerar PNG:', error);
            this.showSuccessMessage('Erro ao gerar PNG. Tente novamente.');
        }
    }

    // Generic download function
    downloadFile(content, mimeType, extension) {
        const weekStart = this.currentWeekDates[0].toISOString().split('T')[0];
        const filename = `timesheet_${weekStart}.${extension}`;
        
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Show success message
        this.showSuccessMessage(`Arquivo ${filename} baixado com sucesso!`);
    }

    // Show success message
    showSuccessMessage(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed';
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 5000);
    }
}

// Global functions for button actions
function resetWeek() {
    if (confirm('Tem certeza que deseja resetar todos os dados da semana?')) {
        timesheetManager.resetWeek();
    }
}

function exportData() {
    timesheetManager.exportData();
}

// Initialize the application
let timesheetManager;
document.addEventListener('DOMContentLoaded', () => {
    timesheetManager = new TimesheetManager();
});
