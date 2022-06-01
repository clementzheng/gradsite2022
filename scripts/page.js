let designerObj;

window.onload = () => {
    loadProjects();
    const params = new URLSearchParams(document.location.search);
    const index = +params.get("id").split("_")[1];
    const location = params.get("location");
    designerObj = DATA.designers[index];

    document.title = designerObj.preferred ? designerObj.preferred : designerObj.name;

    document.querySelector("#designer-content-btn").addEventListener("click", (e) => {
        showDesigner();
    });

    document.querySelector("#projects-content-btn").addEventListener("click", (e) => {
        showProjects();
    });

    // console.log(designerObj);
    document.querySelector("#designer-container").append(generateDesignerContent(designerObj));

    if (designerObj.thesis === undefined && designerObj.projects.length === 0) {
        document.querySelector("#projects-content-btn").classList.add("hidden");
    } else {
        document.querySelector("#projects-container").append(...generateProjectsContainer(designerObj));
    }

    switch (location) {
        case "designer":
            showDesigner();
            break;
        case "projects":
            showProjects();
            break;
    }

    document.addEventListener("scroll", (e) => {
        const h = window.innerHeight * 0.5;
        let cross = false;
        document.querySelectorAll(".project-frame").forEach((p) => {
            const rect = p.getBoundingClientRect();
            if (rect.y + rect.height - h > 0 && !cross) {
                if (document.querySelector("#projects-menu .menu-item.active")) {
                    document.querySelector("#projects-menu .menu-item.active").classList.remove("active");
                }
                const activeItem = document.querySelector(`#menu_${p.id}`);
                if (activeItem) {
                    activeItem.classList.add("active");
                }
                cross = true;
            }
        });
    });
};

const showDesigner = () => {
    const active  = document.querySelectorAll(".active.container");
    if (active.length > 0) {
        active.forEach(d => {
            d.classList.remove("active");
        });
    }
    document.querySelector("#projects-content-btn").classList.remove("active");
    document.querySelector("#designer-content-btn").classList.add("active");
    const designer = document.querySelector("#designer-container");
    if (designer) {
        designer.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
}

const showProjects = () => {
    const active  = document.querySelectorAll(".active.container");
    if (active.length > 0) {
        active.forEach(d => {
            d.classList.remove("active");
        });
    }
    document.querySelector("#projects-content-btn").classList.add("active");
    document.querySelector("#designer-content-btn").classList.remove("active");
    const projects = document.querySelector("#projects-container");
    if (projects) {
        projects.classList.add("active");
    }

    if (document.querySelector("#projects-menu .menu-item.active")) {
        const rect = document.querySelector("#projects-menu .menu-item.active").getBoundingClientRect();
        window.scrollTo({
            top: rect.scrollTop + 200,
            left: 0,
            behavior: 'smooth'
            });
    } else {
        document.querySelector("#projects-menu .menu-item").classList.add("active");
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
    }
}

const loadProjects = () => {
    DATA.designers.forEach(d => {
        d.thesis = DATA.thesis.find(t => (t.designers[0].id === d.id));
        d.projects = DATA.projects.filter(p => {
            let filtered = false;
            p.designers.forEach(des => {
                if (des.id === d.id) {
                    // console.log(p.name, DATA.designers[des.index], "1");
                    filtered = true;
                }
            });
            return filtered;
        });
    });
}

const generateDesignerContent = (d) => {
    const frame = document.createElement("div");
    frame.classList.add("designer-frame");
    frame.classList.add("frame");

    const portrait = document.createElement("div");
    portrait.classList.add("page-designer-portrait");
    portrait.style.backgroundImage = `url(assets/designers/${d.imageNames[0]})`;
    
    const blurb = d.description.split(/\r?\n/);

    const innerFrame = document.createElement("div");
    innerFrame.classList.add("page-designer-info");

    const name = document.createElement("div");
    name.classList.add("page-designer-name");
    name.innerHTML = d.preferred;

    const innerFrameA = document.createElement("div");
    innerFrameA.classList.add("page-designer-quote");
    innerFrameA.innerHTML = `${blurb[0]}`;

    const innerFrameB = document.createElement("div");
    innerFrameB.classList.add("page-designer-description-div");
    innerFrameB.innerHTML += `<div class="page-designer-description">${blurb[blurb.length - 1]}</div>`;
    innerFrameB.innerHTML += d.link ? `<div class="page-designer-portfolio">view my <a href="${d.link}" target="_blank">portfolio</a></div>` : "";
    if (d.linkedin || d.email) {
        innerFrameB.innerHTML += `<div class="page-designer-links">connect with me: ${d.linkedin ? `<a href="${d.linkedin}" target="_blank"><img src="assets/li.svg"></a>` : ""} ${d.email ? `<a href="mailto:${d.email}" target="_blank"><img src="assets/mail.svg"></a>` : ""}</div>`;
    }

    innerFrame.append(name, innerFrameA, innerFrameB);
    frame.append(portrait, innerFrame);

    return frame;
}

const generateProjectsContainer = (d) => {
    const projectsHolder = document.createElement("div");
    projectsHolder.id = "projects-content";

    const projectsMenu = document.createElement("div");
    projectsMenu.id = "projects-menu";

    const menuHeading = document.createElement("div");
    menuHeading.classList.add("menu-heading");
    menuHeading.innerHTML = "All works";

    projectsMenu.append(menuHeading);

    if (d.thesis) {
        const thesisFrame = generateThesisContent(d.thesis);
        projectsHolder.append(thesisFrame);

        const thesisMenu = document.createElement("div");
        thesisMenu.id = `menu_${d.thesis.id}`;
        thesisMenu.classList.add("menu-item");
        const bgimg = `url('assets/thesis/${d.thesis.imageNames[0]}')`;
        thesisMenu.innerHTML = `<div class="menu-image" style="background-image: ${bgimg};"></div><span>${d.thesis.name}</span>`;

        thesisMenu.addEventListener("click", (e) => {
            const rect = document.querySelector(`#${d.thesis.id}`).getBoundingClientRect();
            const val = rect.top + window.scrollY;
            window.scrollTo({
                top: val - 200,
                left: 0,
                behavior: 'smooth'
              });
        });

        projectsMenu.append(thesisMenu);
    }

    d.projects.forEach((p) => {
        const projFrame = generateProjectContent(p);
        projectsHolder.append(projFrame);

        const projMenu = document.createElement("div");
        projMenu.id = `menu_${p.id}`;
        projMenu.classList.add("menu-item");
        const bgimg = `url('assets/projects/${p.imageNames[0]}')`;
        projMenu.innerHTML = `<div class="menu-image" style="background-image: ${bgimg};"></div><span>${p.name}</span>`;

        projMenu.addEventListener("click", (e) => {
            const rect = document.querySelector(`#${p.id}`).getBoundingClientRect();
            const val = rect.top + window.scrollY;
            window.scrollTo({
                top: val - 200,
                left: 0,
                behavior: 'smooth'
              });
        });

        projectsMenu.append(projMenu);
    })

    return [projectsHolder, projectsMenu];
};

const generateThesisContent = (p) => {
    const frame = document.createElement("div");
    frame.classList.add("project-frame");
    frame.classList.add("frame");
    frame.id = p.id;

    const title = document.createElement("div");
    title.classList.add("project-title");
    title.innerHTML = `<h1>${p.name}</h1><p>Supervisor: ${DATA.leaders[p.supervisors[0].index].name}</p>`;
    
    const hero = document.createElement("div");
    hero.classList.add("project-hero");
    hero.innerHTML = `${marked.parse(p.description)}`;
    hero.innerHTML += `<img src="assets/thesis/${p.imageNames[0]}">`;

    frame.append(title, hero);

    p.imageNames.forEach((n, i) => {
        if (i > 0) {
            const caption = document.createElement("div");
            caption.classList.add("project-caption");
            caption.innerHTML = `<img src="assets/thesis/${n}"><div class="caption">${p.captions[i] ? marked.parse(p.captions[i]) : ""}</div>`;
            frame.append(caption);
        }
    });
    
    if (p.video) {
        const video = document.createElement("div");
        video.classList.add("project-video");
        
        if (p.video.type === "youtube") {
            video.innerHTML = `<iframe width="100%" height="360" src="https://www.youtube.com/embed/${p.video.id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        } else if (p.video.type === "vimeo") {
            video.innerHTML = `<iframe src="https://player.vimeo.com/video/${p.video.id}" width="100%" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
        } else {
            video.innerHTML = "";
        }

        frame.append(video);
    }


    return frame;
};


const generateProjectContent = (p) => {
    const frame = document.createElement("div");
    frame.classList.add("project-frame");
    frame.classList.add("frame");
    frame.id = p.id;

    const title = document.createElement("div");
    title.classList.add("project-title");
    let leaders = "";

    if (p.platform) {
        DATA.platforms[p.platform.index].leaders.forEach((l, i, arr) => {
            leaders += DATA.leaders[l.index].name;
            if (i < arr.length - 1) leaders += ", ";
        });
    }

    let designers = "";
    p.designers.forEach((d, i, arr) => {
        designers += DATA.designers[d.index].preferred ? DATA.designers[d.index].preferred : DATA.designers[d.index].name;
        if (i < arr.length - 1) {
            designers += ", ";
        }
    });
    if (p.collaborators) {
        designers += p.collaborators !== "" ? `, ${p.collaborators}` : "";
    }
    title.innerHTML = `<h1>${p.name}</h1>${p.platform ? `<p>Platform: <i>${DATA.platforms[p.platform.index].name}</i> by ${leaders}</p>` : ""}<p>Designers: ${designers}</p>`;
    
    const hero = document.createElement("div");
    hero.classList.add("project-hero");
    hero.innerHTML = `${marked.parse(p.description)}`;
    hero.innerHTML += `<img src="assets/projects/${p.imageNames[0]}">`;

    frame.append(title, hero);

    p.imageNames.forEach((n, i) => {
        if (i > 0) {
            const caption = document.createElement("div");
            caption.classList.add("project-caption");
            caption.innerHTML = `<img src="assets/projects/${n}"><div class="caption">${p.captions[i] ? marked.parse(p.captions[i]) : ""}</div>`;
            frame.append(caption);
        }
    });
    
    if (p.video) {
        const video = document.createElement("div");
        video.classList.add("project-video");
        
        if (p.video.type === "youtube") {
            video.innerHTML = `<iframe width="100%" height="360" src="https://www.youtube.com/embed/${p.video.id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        } else if (p.video.type === "vimeo") {
            video.innerHTML = `<iframe src="https://player.vimeo.com/video/${p.video.id}" width="100%" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
        } else {
            video.innerHTML = "";
        }

        frame.append(video);
    }


    return frame;
};