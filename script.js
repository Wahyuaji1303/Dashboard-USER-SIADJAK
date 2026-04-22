function showPage(id, el = null){
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");

  const titleMap = {
    dash: "Home >> Dashboard",
    arsip: "Home >> Kelola Arsip"
  };

  document.getElementById("breadcrumb").innerText = titleMap[id] || "Home";

  if (el) {
    document.querySelectorAll(".menu-item").forEach(item => item.classList.remove("active"));
    el.classList.add("active");
  }

  closeSidebar();
}

function toggleSidebar(){
  if (window.innerWidth <= 768) {
    document.getElementById("sidebar").classList.toggle("show-mobile");
    document.getElementById("sidebarOverlay").classList.toggle("show");
  }
}

function closeSidebar(){
  if (window.innerWidth <= 768) {
    document.getElementById("sidebar").classList.remove("show-mobile");
    document.getElementById("sidebarOverlay").classList.remove("show");
  }
}

function toggleDropdown(){
  document.getElementById("dropdownUser").classList.toggle("show");
}

window.addEventListener("click", function(e){
  const trigger = document.querySelector(".user-trigger");
  const dropdown = document.getElementById("dropdownUser");

  if (trigger && dropdown && !trigger.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove("show");
  }
});

/* PROFIL USER LOGIN
   Harus akun user yang mengirim arsip, bukan admin.
   Simulasinya diambil dari akun user login saat ini. */
const currentUser = {
  nama: "Brendy Bagus",
  email: "BrendyBagus@gmail.com",
  role: "User",
  username: "Brendy123",
  status: "Aktif"
};

document.getElementById("currentUserTop").innerText = `👤 ${currentUser.nama.split(" ")[0]}`;

function showInfoUser(){
  document.getElementById("profileNama").innerText = currentUser.nama;
  document.getElementById("profileEmail").innerText = currentUser.email;
  document.getElementById("profileRole").innerText = currentUser.role;
  document.getElementById("profileUsername").innerText = currentUser.username;
  document.getElementById("profileStatus").innerText = currentUser.status;

  document.getElementById("dropdownUser").classList.remove("show");
  document.getElementById("modalProfileUser").classList.add("show");
}

function closeProfileModal(){
  document.getElementById("modalProfileUser").classList.remove("show");
}

function logoutUser(){
  if(confirm("Yakin ingin logout?")){
    alert("Logout berhasil.");
    location.reload();
  }
}

const defaultData = [
  {
    no: "2500001479226",
    nama: "Pembangunan Gudang Pelet",
    kontraktor: "Dua Sinar Duta Jaya",
    masa: "14 April 2025 s/d 31 Agustus 2025",
    tanggal: "15 April 2025",
    boks: "Filling Cabinet 5 Laci 1",
    file: "79226_DuaSinarDutaJaya.pdf",
    status: "Terkirim",
    pengirim: "Brendy Bagus",
    emailPengirim: "BrendyBagus@gmail.com"
  },
  {
    no: "2500001470014",
    nama: "Instalasi Pipa Gas PGN",
    kontraktor: "Trijayamahe",
    masa: "19 Februari 2025 s/d 31 Mei 2025",
    tanggal: "20 Februari 2025",
    boks: "Filling Cabinet 5 Laci 1",
    file: "70014_Trijayamahe.pdf",
    status: "Terkirim",
    pengirim: "Trijayamahe",
    emailPengirim: "Trijayamahe@gmail.com"
  },
  {
    no: "2500001466655",
    nama: "Pekerjaan Maintenance Pabrik GDS",
    kontraktor: "Barito Anugrah Sejati",
    masa: "1 Januari 2025 s/d 30 Juni 2025",
    tanggal: "2 Januari 2025",
    boks: "Filling Cabinet 5 Laci 1",
    file: "66655_BaritoAnugrahSejati.pdf",
    status: "Terkirim",
    pengirim: "Barito Anugrah",
    emailPengirim: "BaritoAnugrahSejati@gmail.com"
  }
];

let data = JSON.parse(localStorage.getItem("arsip_user_siadjak_dua_menu_view_only"));

if (!data || data.length === 0) {
  data = defaultData;
  localStorage.setItem("arsip_user_siadjak_dua_menu_view_only", JSON.stringify(data));
}

let currentBerkas = null;

function loadData(){
  renderDashboard();
  renderKelola();
}

function renderDashboard(){
  document.getElementById("totalArsip").innerText = data.length;

  const latestList = document.getElementById("latestList");
  latestList.innerHTML = "";

  const jumlah = parseInt(document.getElementById("jumlahTampil").value, 10) || 3;

  data.slice(0, jumlah).forEach(item => {
    latestList.innerHTML += `
      <div class="latest-item">
        <div class="latest-left">
          <div class="icon">📁</div>
          <div>
            <strong>${item.no}</strong>
            <span>${item.kontraktor}</span>
          </div>
        </div>
        <div class="latest-date">${formatTanggalSingkat(item.tanggal)}</div>
      </div>
    `;
  });
}

function formatTanggalSingkat(tanggal){
  const bulanMap = {
    Januari: "1",
    Februari: "2",
    Maret: "3",
    April: "4",
    Mei: "5",
    Juni: "6",
    Juli: "7",
    Agustus: "8",
    September: "9",
    Oktober: "10",
    November: "11",
    Desember: "12"
  };

  const parts = tanggal.split(" ");
  if (parts.length >= 3) {
    const hari = parts[0];
    const bulan = bulanMap[parts[1]] || parts[1];
    const tahun = parts[2];
    return `${hari}/${bulan}/${tahun}`;
  }

  return tanggal;
}

function renderKelola(list = data){
  const table = document.getElementById("dataArsip");
  table.innerHTML = "";

  list.forEach(d => {
    const indexAsli = data.findIndex(item => item.no === d.no && item.file === d.file);

    table.innerHTML += `
      <tr>
        <td><strong>${d.no}</strong></td>
        <td>${d.nama}</td>
        <td>${d.kontraktor}</td>
        <td>${d.masa}</td>
        <td>${d.tanggal}</td>
        <td>${d.boks}</td>
        <td><span class="status-kirim">${d.status || "Terkirim"}</span></td>
        <td>
          <button class="aksi-btn" type="button" onclick="lihatBerkas(${indexAsli})">Lihat Berkas</button>
        </td>
      </tr>
    `;
  });

  if (list.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center;">Data arsip tidak ditemukan</td>
      </tr>
    `;
  }
}

function filterKelola(){
  const keyword = document.getElementById("searchArsipKelola").value.toLowerCase();

  const hasil = data.filter(d => {
    const isi = `${d.no} ${d.nama} ${d.kontraktor} ${d.tanggal} ${d.boks} ${d.status}`.toLowerCase();
    return isi.includes(keyword);
  });

  renderKelola(hasil);
}

function lihatBerkas(index){
  currentBerkas = data[index];

  document.getElementById("modalNamaFile").innerText = currentBerkas.file || "-";
  document.getElementById("modalNoProyek").innerText = currentBerkas.no || "-";
  document.getElementById("modalNamaProyek").innerText = currentBerkas.nama || "-";
  document.getElementById("modalKontraktor").innerText = currentBerkas.kontraktor || "-";
  document.getElementById("modalTanggal").innerText = currentBerkas.tanggal || "-";
  document.getElementById("modalStatus").innerText = currentBerkas.status || "Terkirim";

  document.getElementById("modalLihatBerkas").classList.add("show");
}

function closeModal(){
  document.getElementById("modalLihatBerkas").classList.remove("show");
}

function downloadDummy(){
  if (!currentBerkas) return;
  alert("Download berkas: " + currentBerkas.file);
}

window.addEventListener("click", function(e){
  const modalBerkas = document.getElementById("modalLihatBerkas");
  const modalProfile = document.getElementById("modalProfileUser");

  if (e.target === modalBerkas) {
    closeModal();
  }

  if (e.target === modalProfile) {
    closeProfileModal();
  }
});

window.addEventListener("resize", function(){
  if (window.innerWidth > 768) {
    document.getElementById("sidebar").classList.remove("show-mobile");
    document.getElementById("sidebarOverlay").classList.remove("show");
  }
});

window.onload = function(){
  loadData();
};