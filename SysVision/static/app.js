"use strict";

const $ = (id) => document.getElementById(id);
const historyData = { labels: [], cpu: [], ram: [] };
let chart = null;
let liveStats = null;
let workload = 35;
let stressDemo = false;
let toastTimer = null;

const randomBetween = (min, max) => Math.random() * (max - min) + min;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const formatTime = (date = new Date()) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

function setText(id, value) {
  const node = $(id);
  if (node) node.textContent = value;
}

function setBar(id, value, max = 100) {
  const node = $(id);
  if (node) node.style.width = `${clamp((Number(value) / max) * 100, 0, 100)}%`;
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function updateConnection(connected) {
  const dot = $("serviceDot");
  dot.style.background = connected ? "var(--green)" : "var(--amber)";
  setText("serviceLabel", connected ? "Service online" : "Demo mode active");
  setText("serviceSub", connected ? "Local Python API" : "Live API unavailable");
  setText("modeLabel", connected ? "Live connection" : "Simulation mode");
  setText("sourceValue", connected ? "LIVE + DEMO" : "SIMULATION");
  setText("sourceDetail", connected ? "System stats connected" : "Using demo readings");
  $("sourceValue").style.color = connected ? "var(--green)" : "var(--amber)";
}

function initChart() {
  const canvas = $("performanceChart");
  if (!window.Chart || !canvas) {
    $("chartFallback").style.display = "block";
    return;
  }
  $("chartFallback").style.display = "none";
  chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: historyData.labels,
      datasets: [
        { label: "CPU", data: historyData.cpu, borderColor: "#5b9bff", backgroundColor: "rgba(91,155,255,.10)", fill: true, tension: .36, pointRadius: 0, borderWidth: 2 },
        { label: "Memory", data: historyData.ram, borderColor: "#aa91ff", backgroundColor: "rgba(170,145,255,.04)", fill: false, tension: .36, pointRadius: 0, borderWidth: 2 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 250 },
      plugins: { legend: { display: false }, tooltip: { mode: "index", intersect: false } },
      interaction: { mode: "index", intersect: false },
      scales: {
        x: { grid: { display: false }, ticks: { color: "#718098", maxTicksLimit: 6, font: { size: 9 } }, border: { display: false } },
        y: { min: 0, max: 100, grid: { color: "rgba(125,145,175,.12)" }, ticks: { color: "#718098", stepSize: 25, callback: (v) => `${v}%`, font: { size: 9 } }, border: { display: false } }
      }
    }
  });
}

function updateChart(cpu, ram) {
  const maxPoints = Number($("chartRange").value) || 20;
  historyData.labels.push(formatTime().slice(0, 5));
  historyData.cpu.push(cpu);
  historyData.ram.push(ram);
  while (historyData.labels.length > maxPoints) {
    historyData.labels.shift();
    historyData.cpu.shift();
    historyData.ram.shift();
  }
  if (chart) chart.update("none");
}

function renderDiagnostics(cpu, ram, disk, temperature) {
  const issues = [];
  if (cpu >= 85) issues.push({ title: "High CPU utilization", detail: "Processor load is high. Check demanding apps or reduce the demo workload.", warning: true });
  else issues.push({ title: "CPU utilization", detail: "Processor load is within the configured demo threshold.", warning: false });
  if (ram >= 90) issues.push({ title: "High memory usage", detail: "Memory is nearly full. Close unused applications if this is a live reading.", warning: true });
  else issues.push({ title: "Memory usage", detail: "Memory use is below the 90% warning threshold.", warning: false });
  if (disk >= 95) issues.push({ title: "Low disk capacity", detail: "Storage is almost full. Consider removing unneeded files.", warning: true });
  else issues.push({ title: "Storage capacity", detail: "Storage use is below the 95% warning threshold.", warning: false });
  if (temperature >= 85) issues.push({ title: "Simulated thermal warning", detail: "The demo temperature is high. This value is simulated, not a real sensor reading.", warning: true });
  else issues.push({ title: "Simulated thermal status", detail: "Demo temperature is below the 85°C warning threshold.", warning: false });

  const warningCount = issues.filter((x) => x.warning).length;
  setText("navAlertCount", warningCount);
  setText("healthBadge", warningCount ? `${warningCount} WARNING${warningCount > 1 ? "S" : ""}` : "ALL CHECKS OK");
  $("healthBadge").style.color = warningCount ? "var(--amber)" : "var(--green)";
  $("healthBadge").style.background = warningCount ? "#3c2e1d" : "#17372f";
  $("diagnosticList").innerHTML = issues.map((item) => `
    <div class="diagnostic-item">
      <span class="diagnostic-icon ${item.warning ? "warning" : ""}">${item.warning ? "!" : "✓"}</span>
      <div class="diagnostic-copy"><b>${item.title}</b><small>${item.detail}</small></div>
      <span class="diagnostic-state ${item.warning ? "warning" : ""}">${item.warning ? "CHECK" : "NORMAL"}</span>
    </div>`).join("");
}

function renderLiveStats(stats) {
  liveStats = stats;
  const cpu = Math.round(stats.cpu_percent);
  const ram = Math.round(stats.memory_percent);
  const disk = Math.round(stats.disk_percent);
  setText("deviceName", stats.hostname || "Local computer");
  setText("platformName", stats.platform || "System information available");
  setText("uptimeValue", `${stats.uptime_hours} hrs`);
  setText("cpuValue", cpu);
  setText("ramValue", ram);
  setText("diskValue", disk);
  setText("ramDetail", `${stats.memory_used_gb} / ${stats.memory_total_gb} GB used`);
  setText("diskDetail", `${stats.disk_used_gb} / ${stats.disk_total_gb} GB used`);
  setText("cpuFoot", cpu >= 85 ? "High utilization" : "Normal activity");
  setText("ramFoot", ram >= 90 ? "Near capacity" : "Available capacity");
  setText("diskFoot", disk >= 95 ? "Low free space" : "Storage available");
  setBar("cpuBar", cpu);
  setBar("ramBar", ram);
  setBar("diskBar", disk);
  setText("lastUpdated", `Updated ${formatTime()}`);
  updateConnection(true);
  return { cpu, ram, disk };
}

function renderSimulation(real = null) {
  const loadFactor = workload / 100;
  const cpu = real ? real.cpu : Math.round(clamp(10 + loadFactor * 75 + randomBetween(-7, 7), 1, 100));
  const ram = real ? real.ram : Math.round(clamp(28 + loadFactor * 52 + randomBetween(-3, 3), 5, 99));
  const disk = real ? real.disk : Math.round(clamp(43 + randomBetween(-1, 1), 1, 99));
  const cpuTemp = Math.round(clamp(34 + loadFactor * 59 + randomBetween(-2, 2), 30, 99));
  const gpuTemp = Math.round(clamp(35 + loadFactor * 50 + randomBetween(-3, 3), 30, 95));
  const fan = Math.round(700 + loadFactor * 2100 + randomBetween(-80, 80));
  const gpuLoad = Math.round(clamp(8 + loadFactor * 85 + randomBetween(-5, 5), 0, 100));

  setText("tempValue", cpuTemp);
  setBar("tempBar", cpuTemp, 100);
  setText("tempFoot", cpuTemp >= 85 ? "Demo warning" : "Normal demo range");
  setText("gpuTemp", `${gpuTemp}°`);
  setBar("gpuTempBar", gpuTemp, 100);
  setText("fanSpeed", `${fan.toLocaleString()} RPM`);
  setBar("fanBar", fan, 3000);
  setText("gpuLoad", `${gpuLoad}%`);
  setBar("gpuLoadBar", gpuLoad);
  setText("workloadValue", `${workload}%`);

  if (!real) {
    setText("deviceName", "SysVision Demo Environment");
    setText("platformName", "Live computer connection unavailable · simulated metrics");
    setText("uptimeValue", "Demo");
    setText("cpuValue", cpu);
    setText("ramValue", ram);
    setText("diskValue", disk);
    setText("ramDetail", "Simulated memory use");
    setText("diskDetail", "Simulated storage use");
    setText("cpuFoot", cpu >= 85 ? "High demo load" : "Demo activity");
    setText("ramFoot", ram >= 90 ? "Near capacity" : "Demo capacity");
    setText("diskFoot", "Demo reading");
    setBar("cpuBar", cpu);
    setBar("ramBar", ram);
    setBar("diskBar", disk);
    setText("lastUpdated", `Demo updated ${formatTime()}`);
    updateConnection(false);
  }
  updateChart(cpu, ram);
  renderDiagnostics(cpu, ram, disk, cpuTemp);
}

async function refreshLive() {
  try {
    const response = await fetch("/api/stats", { cache: "no-store" });
    if (!response.ok) throw new Error("Local API returned an error");
    const stats = await response.json();
    const real = renderLiveStats(stats);
    renderSimulation(real);
  } catch (error) {
    renderSimulation(null);
  }
}

$("workloadSlider").addEventListener("input", (event) => {
  workload = Number(event.target.value);
  setText("workloadValue", `${workload}%`);
  renderSimulation(liveStats ? { cpu: liveStats.cpu_percent, ram: liveStats.memory_percent, disk: liveStats.disk_percent } : null);
});

$("stressButton").addEventListener("click", () => {
  stressDemo = !stressDemo;
  workload = stressDemo ? 100 : Number($("workloadSlider").value);
  $("workloadSlider").value = workload;
  setText("workloadValue", `${workload}%`);
  $("stressButton").textContent = stressDemo ? "Stop stress demo" : "Run stress demo";
  renderSimulation(liveStats ? { cpu: liveStats.cpu_percent, ram: liveStats.memory_percent, disk: liveStats.disk_percent } : null);
  showToast(stressDemo ? "Maximum simulated workload enabled." : "Simulated workload returned to the slider setting.");
});

$("resetButton").addEventListener("click", () => {
  stressDemo = false;
  workload = 35;
  $("workloadSlider").value = 35;
  setText("workloadValue", "35%");
  $("stressButton").textContent = "Run stress demo";
  refreshLive();
  showToast("Demo settings reset.");
});

$("chartRange").addEventListener("change", () => {
  if (!chart) return;
  const count = Number($("chartRange").value);
  while (historyData.labels.length > count) {
    historyData.labels.shift(); historyData.cpu.shift(); historyData.ram.shift();
  }
  chart.update();
});

$("themeButton").addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  const light = document.body.classList.contains("light-theme");
  localStorage.setItem("sysvision-theme", light ? "light" : "dark");
  $("themeButton").textContent = light ? "☀" : "◐";
  if (chart) {
    const color = light ? "#687990" : "#718098";
    chart.options.scales.x.ticks.color = color;
    chart.options.scales.y.ticks.color = color;
    chart.options.scales.y.grid.color = light ? "rgba(80,100,130,.14)" : "rgba(125,145,175,.12)";
    chart.update();
  }
});

if (localStorage.getItem("sysvision-theme") === "light") {
  document.body.classList.add("light-theme");
  $("themeButton").textContent = "☀";
}

$("menuButton").addEventListener("click", () => $("sidebar").classList.toggle("open"));
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
    $("sidebar").classList.remove("open");
  });
});

initChart();
refreshLive();
setInterval(refreshLive, 2000);
