const grid = document.getElementById("grid");
const modal = document.getElementById("modal");
const modalFrame = document.getElementById("modalFrame");
const meta = document.getElementById("meta");
const closeBtn = document.getElementById("close");
const search = document.getElementById("search");
const campaignFilter = document.getElementById("campaignFilter");

let bannersData = [];

fetch('banners.json')
.then(res => res.json())
.then(data => {
  bannersData = data;
  initCampaigns(data);
  render(data);
});

function initCampaigns(data){
  const campaigns = [...new Set(data.map(d => d.campaign))];
  campaignFilter.innerHTML = "<option value=''>All Campaigns</option>";
  campaigns.forEach(c=>{
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    campaignFilter.appendChild(opt);
  });
}

function render(data){
  grid.innerHTML = "";
  data.forEach(item=>{
    const card = document.createElement("div");
    card.className="card";
    card.innerHTML = `
      <h3>${item.size} • ${item.campaign}</h3>
      <iframe loading="lazy" src="banners/${item.path}/index.html"></iframe>
    `;

    card.onclick=()=>{
      modal.style.display="flex";
      modalFrame.src=`banners/${item.path}/index.html`;
      meta.innerHTML = `Size: ${item.size} | Campaign: ${item.campaign}`;
    }

    grid.appendChild(card);
  });
}

closeBtn.onclick=()=>{
  modal.style.display="none";
  modalFrame.src="";
}

search.oninput = filter;
campaignFilter.onchange = filter;

function filter(){
  const text = search.value.toLowerCase();
  const campaign = campaignFilter.value;

  const filtered = bannersData.filter(item=>{
    return (
      item.size.toLowerCase().includes(text) &&
      (campaign === "" || item.campaign === campaign)
    );
  });

  render(filtered);
}
