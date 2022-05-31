window.onload = () => {
    const landing = document.querySelector("#landing");
    const cursor = document.querySelector("#fancy-cursor");
    const cursor2 = document.querySelector("#fancy-cursor-over");
    landing.addEventListener("mousemove", (e) => {
        cursor.style.top = `${e.pageY}px`;
        cursor.style.left = `${e.pageX}px`;
        cursor2.style.top = `${e.pageY}px`;
        cursor2.style.left = `${e.pageX}px`;
    });

    loadProjects();
    generateGallery();

    const params = new URLSearchParams(document.location.search);
    const galleryType = params.get("gallery");
    const filterType = params.get("galleryFilter");

    if (galleryType) {
        switch(galleryType) {
            case "designers":
                openDesignerGallery();
                break;
            case "projects":
                openProjectGallery();
                if (filterType) {
                    applyGalleryFilter(filterType);
                }
                break;
        }
    }

    document.querySelector("#gallery-designers-btn").addEventListener("click", (e) => {
        openDesignerGallery(); 
        applyGalleryFilter("all");
    });

    document.querySelector("#gallery-projects-btn").addEventListener("click", (e) => {
        openProjectGallery(); 
    });

    document.querySelector("#gallery-filter-all").addEventListener("click", (e) => {
        applyGalleryFilter("all"); 
    });

    document.querySelector("#gallery-filter-pi").addEventListener("click", (e) => {
        applyGalleryFilter("Product Innovation"); 
    });

    document.querySelector("#gallery-filter-dfci").addEventListener("click", (e) => {
        applyGalleryFilter("Design Futures Critical Inquiry"); 
    });

    document.querySelector("#gallery-filter-sst").addEventListener("click", (e) => {
        applyGalleryFilter("Social Service Transformation"); 
    });

    document.querySelector("#landing-arrow").addEventListener("click", (e) => {
        document.querySelector("#content").scrollIntoView({behavior: "smooth"});
    });

    document.addEventListener("scroll", (e) => {
        const rect = document.querySelector("#content").getBoundingClientRect();
        if (rect.y < 0) {
            document.querySelector("#gallery-menu").classList.add("sticky");
        } else {
            document.querySelector("#gallery-menu").classList.remove("sticky");
        }
    })
}

const openDesignerGallery = () => {
    const desBtn = document.querySelector("#gallery-designers-btn");
    const proBtn = document.querySelector("#gallery-projects-btn");
    const fil = document.querySelector("#gallery-filter");
    document.querySelector("#gallery-holder").classList.remove("project-view");
    document.querySelector("#gallery-holder").classList.add("designer-view");
    desBtn.classList.add("active");
    proBtn.classList.remove("active");
    fil.classList.remove("active");
    gallery = "designers";

    history.replaceState({}, "", `?gallery=${gallery}&galleryFilter=${galleryFilter}`);
}

const openProjectGallery = () => {
    const desBtn = document.querySelector("#gallery-designers-btn");
    const proBtn = document.querySelector("#gallery-projects-btn");
    const fil = document.querySelector("#gallery-filter");
    document.querySelector("#gallery-holder").classList.remove("designer-view");
    document.querySelector("#gallery-holder").classList.add("project-view");
    desBtn.classList.remove("active");
    proBtn.classList.add("active");
    fil.classList.add("active");
    gallery = "projects";

    history.replaceState({}, "", `?gallery=${gallery}&galleryFilter=${galleryFilter}`);
}

let galleryFilter = "";
let gallery = "";
const applyGalleryFilter = (f) => {
    galleryFilter = f;
    history.replaceState({}, "", `?gallery=${gallery}&galleryFilter=${galleryFilter}`);
    document.querySelectorAll(".gallery-card").forEach((c) => {
        c.classList.remove("active");
    });
    document.querySelector(".gallery-filter-btn.active").classList.remove("active");
    switch (f) {
        case "all":
            document.querySelectorAll(".gallery-card").forEach((c) => {
                c.classList.add("active");
            });
            document.querySelector("#gallery-filter-all").classList.add("active");
            break;
        case "Product Innovation":
            document.querySelectorAll(".gallery-card.spec-pi").forEach((c) => {
                c.classList.add("active");
            });
            document.querySelector("#gallery-filter-pi").classList.add("active");
            break;
        case "Design Futures Critical Inquiry":
            document.querySelectorAll(".gallery-card.spec-dfci").forEach((c) => {
                c.classList.add("active");
            });
            document.querySelector("#gallery-filter-dfci").classList.add("active");
            break;
        case "Social Service Transformation":
            document.querySelectorAll(".gallery-card.spec-sst").forEach((c) => {
                c.classList.add("active");
            });
            document.querySelector("#gallery-filter-sst").classList.add("active");
            break;
    }
}

const loadProjects = () => {
    DATA.designers.forEach(d => {
        d.thesis = DATA.thesis.find(t => (t.designers[0].id === d.id));
        d.projects = DATA.projects.filter(p => {
            // console.log(p);
            if (p.designers.length === 0) {
                return false;
            } else {
                return (p.designers[0].id === d.id);
            }
        });
    });
}

const generateGallery = () => {
    const galleryHolder = document.querySelector("#gallery-holder");

    DATA.designers.forEach((d, i) => {
        const card = document.createElement("div");
        card.classList.add("gallery-card");
        card.classList.add("active");
        card.id = `designer_${i}`;

        const name = document.createElement("span");
        name.classList.add("designer-name");
        name.innerHTML = d.preferred ? d.preferred : d.name;

        const portrait = document.createElement("div");
        portrait.classList.add("designer-portrait");
        portrait.style.backgroundImage = `url(assets/designers/${d.imageNames[0]})`;

        const proj = document.createElement("div");
        proj.classList.add("designer-project");

        const projName = document.createElement("span");
        projName.classList.add("project-name");

        if (d.thesis) {
            card.classList.add("thesis");
            proj.style.backgroundImage = `url(assets/thesis/${d.thesis.imageNames[0]})`;
            projName.innerHTML = d.thesis.name;
            switch(d.thesis.specialization[0]) {
                case "Product Innovation":
                    card.classList.add("spec-pi");
                    break;
                case "Design Futures & Critical Inquiry":
                    card.classList.add("spec-dfci");
                    break;
                case "Social & Service Transformation":
                    card.classList.add("spec-sst");
                    break;
            }
        }
        // else if (d.projects.length > 0) {
        //     proj.style.backgroundImage = `url(assets/projects/${d.projects[0].imageNames[0]})`;
        //     projName.innerHTML = d.projects[0].name;
        // }

        card.addEventListener("click", (e) => {
            if (document.querySelector("#gallery-holder").classList.contains("designer-view")) {
                window.location.href = `./page.html?id=${card.id}&location=designer`;
            } else {
                window.location.href = `./page.html?id=${card.id}&location=projects`;
            }
        });

        card.append(portrait, name, proj, projName);
        galleryHolder.append(card);
    });
};