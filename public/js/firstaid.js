// First Aid Database with expanded content and categories
const firstAidData = {
    burns: {
      title: "Burns Treatment",
      category: "injuries",
      icon: "bi-fire",
      urgency: "high",
      bookmarked: false,
      steps: [
        {
          title: "Cool the burn",
          content:
            "Hold the burned area under cool (not cold) running water for 10 to 15 minutes or until pain subsides. If this is not possible, immerse in cool water or apply cool compresses.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Remove tight items",
          content: "Remove jewelry, belts, and tight clothing from the burned area before swelling begins.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Cover the burn",
          content:
            "Cover with a sterile, non-stick bandage or clean cloth. Wrap loosely to avoid putting pressure on the burned skin.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Take pain reliever",
          content:
            "Over-the-counter pain medications like ibuprofen, naproxen, or acetaminophen can help relieve pain and reduce inflammation.",
          image: "/placeholder.svg?height=200&width=300",
        },
      ],
      warnings: [
        "Don't use ice, as it can damage skin tissue",
        "Don't apply butter, oil, or ointments to burns",
        "Don't break blisters",
        "Seek medical attention for severe burns, chemical burns, or electrical burns",
      ],
      quiz: [
        {
          question: "What should you apply to a burn first?",
          options: ["Ice", "Cool running water", "Butter or oil", "Toothpaste"],
          correctAnswer: 1,
        },
      ],
    },
    fractures: {
      title: "Fractures First Aid",
      category: "injuries",
      icon: "bi-bandaid-fill",
      urgency: "high",
      bookmarked: false,
      steps: [
        {
          title: "Stop any bleeding",
          content: "Apply gentle pressure with a clean bandage or cloth to control bleeding if present.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Immobilize the injury",
          content: "Don't try to realign the bone. Use a splint or sling to prevent movement of the injured area.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Apply ice packs",
          content:
            "Apply ice packs wrapped in a towel to limit swelling and help relieve pain. Do not apply ice directly to the skin.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Treat for shock",
          content: "Lay the person flat, elevate the feet about 12 inches, and cover them with a coat or blanket.",
          image: "/placeholder.svg?height=200&width=300",
        },
      ],
      warnings: [
        "Don't move the person unless absolutely necessary",
        "Don't attempt to straighten a broken bone",
        "Seek immediate medical attention",
      ],
      quiz: [
        {
          question: "What should you do with a suspected fracture?",
          options: ["Try to straighten the bone", "Immobilize the area", "Apply heat", "Massage the area"],
          correctAnswer: 1,
        },
      ],
    },
    heartAttack: {
      title: "Heart Attack Response",
      category: "medical",
      icon: "bi-heart-pulse-fill",
      urgency: "critical",
      bookmarked: false,
      steps: [
        {
          title: "Call emergency services",
          content: "Call 911 or your local emergency number immediately. Every minute matters.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Help the person rest",
          content:
            "Have them sit or lie down in a comfortable position with their head and shoulders supported and knees bent.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Give aspirin if available",
          content:
            "If the person is not allergic to aspirin and has no other contraindications, give them a single adult aspirin (325 mg) or 2-4 low-dose aspirin (81 mg).",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Begin CPR if needed",
          content: "If the person is unconscious and not breathing normally, begin CPR if you're trained.",
          image: "/placeholder.svg?height=200&width=300",
        },
      ],
      warnings: [
        "Chest pain or pressure",
        "Pain in arms, neck, jaw, or back",
        "Shortness of breath",
        "Cold sweat, nausea, lightheadedness",
      ],
      quiz: [
        {
          question: "What is the first thing you should do if someone is having a heart attack?",
          options: [
            "Give them water",
            "Have them lie down and rest",
            "Call emergency services (911)",
            "Drive them to the hospital yourself",
          ],
          correctAnswer: 2,
        },
      ],
    },
    choking: {
      title: "Choking Response",
      category: "medical",
      icon: "bi-lungs-fill",
      urgency: "critical",
      bookmarked: false,
      steps: [
        {
          title: "Identify if person can speak",
          content: "Ask 'Are you choking?' If they can't speak, cough, or breathe, proceed with the Heimlich maneuver.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Position yourself",
          content: "Stand behind the person and wrap your arms around their waist.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Make a fist",
          content:
            "Place your fist with the thumb side against the middle of the person's abdomen, just above the navel.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Perform abdominal thrusts",
          content:
            "Grasp your fist with your other hand and press hard into the abdomen with a quick, upward thrust. Repeat until the object is expelled.",
          image: "/placeholder.svg?height=200&width=300",
        },
      ],
      warnings: [
        "For children under 1 year, use back blows and chest thrusts instead",
        "If the person becomes unconscious, lower them to the ground and begin CPR",
        "Seek medical attention even after successful removal of obstruction",
      ],
      quiz: [
        {
          question: "Where should you position your fist when performing the Heimlich maneuver?",
          options: ["On the chest", "Just above the navel", "On the lower back", "On the throat"],
          correctAnswer: 1,
        },
      ],
    },
    heatstroke: {
      title: "Heatstroke Treatment",
      category: "environmental",
      icon: "bi-thermometer-high",
      urgency: "high",
      bookmarked: false,
      steps: [
        {
          title: "Move to a cool place",
          content: "Get the person out of the heat and into a shaded or air-conditioned area.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Remove excess clothing",
          content: "Remove any unnecessary clothing to help the body cool down faster.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Cool the body",
          content:
            "Use any available method: immerse in cool water, place ice packs or wet towels on the head, neck, armpits, and groin, or spray with cool water and fan.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Rehydrate if conscious",
          content:
            "If the person is fully conscious and able to swallow, give cool water or a sports drink to replace lost fluids and electrolytes.",
          image: "/placeholder.svg?height=200&width=300",
        },
      ],
      warnings: [
        "High body temperature (103°F or higher)",
        "Hot, red, dry skin",
        "Rapid pulse",
        "Headache, dizziness, confusion",
        "Seek immediate medical attention",
      ],
      quiz: [
        {
          question: "What is a key symptom of heatstroke?",
          options: ["Goosebumps", "Cold, clammy skin", "High body temperature with hot, dry skin", "Slow pulse"],
          correctAnswer: 2,
        },
      ],
    },
    snakeBite: {
      title: "Snake Bite First Aid",
      category: "environmental",
      icon: "bi-bug-fill",
      urgency: "high",
      bookmarked: false,
      steps: [
        {
          title: "Move away from the snake",
          content: "Move the person away from the snake to prevent additional bites.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Keep the person calm",
          content: "Keep the person calm and still to slow the spread of venom. Restrict movement as much as possible.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Position the bite below heart",
          content: "If possible, position the bite area below the level of the heart.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Clean the wound",
          content: "Gently clean the wound with soap and water. Cover with a clean, dry dressing.",
          image: "/placeholder.svg?height=200&width=300",
        },
      ],
      warnings: [
        "DO NOT apply a tourniquet",
        "DO NOT try to suck out the venom",
        "DO NOT apply ice or immerse in water",
        "DO NOT give the person anything to eat or drink",
        "Seek immediate medical attention",
      ],
      quiz: [
        {
          question: "What should you NOT do for a snake bite?",
          options: [
            "Keep the person calm and still",
            "Clean the wound with soap and water",
            "Try to suck out the venom",
            "Seek medical attention",
          ],
          correctAnswer: 2,
        },
      ],
    },
    cpr: {
      title: "CPR Instructions",
      category: "cpr",
      icon: "bi-activity",
      urgency: "critical",
      bookmarked: false,
      steps: [
        {
          title: "Check responsiveness",
          content:
            "Tap the person's shoulder and shout 'Are you OK?' to ensure they're unresponsive before beginning CPR.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Call emergency services",
          content: "Call 911 or ask someone else to call immediately.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Position for compressions",
          content:
            "Place the person on their back on a firm surface. Kneel beside their chest. Place the heel of one hand on the center of the chest, then place your other hand on top and interlock your fingers.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Perform chest compressions",
          content:
            "Push hard and fast in the center of the chest, at a rate of 100-120 compressions per minute. Allow the chest to completely recoil between compressions.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Give rescue breaths",
          content:
            "After 30 compressions, give 2 rescue breaths if trained. Tilt the head back, lift the chin, pinch the nose, and create a seal over their mouth with yours. Blow for about 1 second to make the chest rise.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Continue CPR",
          content:
            "Continue cycles of 30 compressions and 2 breaths until emergency services arrive or the person shows signs of life.",
          image: "/placeholder.svg?height=200&width=300",
        },
      ],
      warnings: [
        "If untrained, perform hands-only CPR (compressions only)",
        "Push at least 2 inches deep for adults",
        "Use an AED as soon as one is available",
      ],
      quiz: [
        {
          question: "What is the correct compression to breath ratio in adult CPR?",
          options: [
            "15 compressions to 1 breath",
            "15 compressions to 2 breaths",
            "30 compressions to 1 breath",
            "30 compressions to 2 breaths",
          ],
          correctAnswer: 3,
        },
      ],
      useTimer: true,
    },
    infantChoking: {
      title: "Infant Choking Response",
      category: "pediatric",
      icon: "bi-emoji-frown-fill",
      urgency: "critical",
      bookmarked: false,
      steps: [
        {
          title: "Position the infant",
          content:
            "Hold the infant face down on your forearm, supporting their head and jaw with your hand. Keep the head lower than the body.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Deliver back blows",
          content: "Give up to 5 firm back blows between the infant's shoulder blades using the heel of your hand.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Turn and check",
          content:
            "Turn the infant face up on your forearm, supporting the head. Check if the object has been dislodged.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Perform chest thrusts",
          content:
            "If the object is still lodged, give up to 5 chest thrusts. Place two fingers on the breastbone just below the nipple line and push downward.",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Repeat if necessary",
          content:
            "Continue alternating 5 back blows and 5 chest thrusts until the object is dislodged or the infant becomes unconscious.",
          image: "/placeholder.svg?height=200&width=300",
        },
      ],
      warnings: [
        "DO NOT perform abdominal thrusts (Heimlich) on infants",
        "If the infant becomes unconscious, begin CPR",
        "Seek medical attention even after successful removal of obstruction",
      ],
      quiz: [
        {
          question: "What is the correct sequence for helping a choking infant?",
          options: [
            "Abdominal thrusts only",
            "Back blows followed by chest thrusts",
            "Chest thrusts followed by back blows",
            "Rescue breaths only",
          ],
          correctAnswer: 1,
        },
      ],
    },
  }
  
  // Language translations
  const translations = {
    en: {
      search: "Search first aid guides...",
      filterByCategory: "Filter by Category",
      allCategories: "All",
      injuries: "Injuries",
      medical: "Medical",
      environmental: "Environmental",
      pediatric: "Pediatric",
      cpr: "CPR & Life Support",
      recentlyViewed: "Recently Viewed",
      favorites: "Your Favorites",
      emergencyContacts: "Emergency Contacts",
      wasHelpful: "Was this guide helpful?",
      yes: "Yes",
      no: "No",
      shareGuide: "Share this guide:",
      saveOffline: "Save Offline",
      close: "Close",
      next: "Next",
      previous: "Previous",
      startTimer: "Start",
      resetTimer: "Reset",
      critical: "Critical",
      important: "Important",
      warning: "Warning",
      note: "Note",
    },
    es: {
      search: "Buscar guías de primeros auxilios...",
      filterByCategory: "Filtrar por categoría",
      allCategories: "Todos",
      injuries: "Lesiones",
      medical: "Médico",
      environmental: "Ambiental",
      pediatric: "Pediátrico",
      cpr: "RCP y soporte vital",
      recentlyViewed: "Vistos recientemente",
      favorites: "Tus favoritos",
      emergencyContacts: "Contactos de emergencia",
      wasHelpful: "¿Fue útil esta guía?",
      yes: "Sí",
      no: "No",
      shareGuide: "Compartir esta guía:",
      saveOffline: "Guardar sin conexión",
      close: "Cerrar",
      next: "Siguiente",
      previous: "Anterior",
      startTimer: "Iniciar",
      resetTimer: "Reiniciar",
      critical: "Crítico",
      important: "Importante",
      warning: "Advertencia",
      note: "Nota",
    },
    fr: {
      search: "Rechercher des guides de premiers secours...",
      filterByCategory: "Filtrer par catégorie",
      allCategories: "Tous",
      injuries: "Blessures",
      medical: "Médical",
      environmental: "Environnemental",
      pediatric: "Pédiatrique",
      cpr: "RCP et réanimation",
      recentlyViewed: "Consultés récemment",
      favorites: "Vos favoris",
      emergencyContacts: "Contacts d'urgence",
      wasHelpful: "Ce guide a-t-il été utile?",
      yes: "Oui",
      no: "Non",
      shareGuide: "Partager ce guide:",
      saveOffline: "Enregistrer hors ligne",
      close: "Fermer",
      next: "Suivant",
      previous: "Précédent",
      startTimer: "Démarrer",
      resetTimer: "Réinitialiser",
      critical: "Critique",
      important: "Important",
      warning: "Avertissement",
      note: "Remarque",
    },
    de: {
      search: "Erste-Hilfe-Anleitungen suchen...",
      filterByCategory: "Nach Kategorie filtern",
      allCategories: "Alle",
      injuries: "Verletzungen",
      medical: "Medizinisch",
      environmental: "Umweltbedingt",
      pediatric: "Pädiatrisch",
      cpr: "CPR & Lebenserhaltung",
      recentlyViewed: "Kürzlich angesehen",
      favorites: "Ihre Favoriten",
      emergencyContacts: "Notfallkontakte",
      wasHelpful: "War diese Anleitung hilfreich?",
      yes: "Ja",
      no: "Nein",
      shareGuide: "Diese Anleitung teilen:",
      saveOffline: "Offline speichern",
      close: "Schließen",
      next: "Weiter",
      previous: "Zurück",
      startTimer: "Start",
      resetTimer: "Zurücksetzen",
      critical: "Kritisch",
      important: "Wichtig",
      warning: "Warnung",
      note: "Hinweis",
    },
    zh: {
      search: "搜索急救指南...",
      filterByCategory: "按类别筛选",
      allCategories: "全部",
      injuries: "伤害",
      medical: "医疗",
      environmental: "环境",
      pediatric: "儿科",
      cpr: "心肺复苏和生命支持",
      recentlyViewed: "最近查看",
      favorites: "您的收藏",
      emergencyContacts: "紧急联系人",
      wasHelpful: "这个指南有帮助吗？",
      yes: "是",
      no: "否",
      shareGuide: "分享此指南：",
      saveOffline: "离线保存",
      close: "关闭",
      next: "下一步",
      previous: "上一步",
      startTimer: "开始",
      resetTimer: "重置",
      critical: "危急",
      important: "重要",
      warning: "警告",
      note: "注意",
    },
  }
  
  // Global variables
  let currentLanguage = "en"
  let currentScenario = null
  let currentStep = 0
  let cprTimer = null
  let cprTimerInterval = null
  const speechSynthesis = window.speechSynthesis
  let voiceGuidanceActive = false
  let recentlyViewed = []
  let customContacts = []
  let quizCurrentQuestion = 0
  
  // Initialize page
  document.addEventListener("DOMContentLoaded", () => {
    initializeApp()
  })
  
  function initializeApp() {
    loadBookmarks()
    loadRecentlyViewed()
    loadCustomContacts()
    populateFirstAidCards()
    populateFavorites()
    populateRecentlyViewed()
    initializeEventListeners()
    initializeSearch()
    initializeFilters()
    initializeLanguageSelector()
    detectLocation()
  }
  
  // Load bookmarks from localStorage
  function loadBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem("firstAidBookmarks")) || []
    bookmarks.forEach((key) => {
      if (firstAidData[key]) {
        firstAidData[key].bookmarked = true
      }
    })
  }
  
  // Save bookmarks to localStorage
  function saveBookmarks() {
    const bookmarks = Object.keys(firstAidData).filter((key) => firstAidData[key].bookmarked)
    localStorage.setItem("firstAidBookmarks", JSON.stringify(bookmarks))
  }
  
  // Load recently viewed from localStorage
  function loadRecentlyViewed() {
    recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || []
  }
  
  // Save recently viewed to localStorage
  function saveRecentlyViewed() {
    // Keep only the last 5 items
    if (recentlyViewed.length > 5) {
      recentlyViewed = recentlyViewed.slice(0, 5)
    }
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed))
  }
  
  // Add to recently viewed
  function addToRecentlyViewed(scenario) {
    // Remove if already exists
    recentlyViewed = recentlyViewed.filter((item) => item !== scenario)
    // Add to beginning of array
    recentlyViewed.unshift(scenario)
    saveRecentlyViewed()
    populateRecentlyViewed()
  }
  
  // Populate recently viewed section
  function populateRecentlyViewed() {
    const recentItems = document.getElementById("recentItems")
    if (!recentItems) return
  
    recentItems.innerHTML = ""
  
    if (recentlyViewed.length === 0) {
      document.getElementById("recentlyViewed").style.display = "none"
      return
    }
  
    document.getElementById("recentlyViewed").style.display = "block"
  
    recentlyViewed.forEach((scenario) => {
      if (firstAidData[scenario]) {
        const item = document.createElement("div")
        item.className = "recent-item"
        item.innerHTML = `
                  <i class="bi ${firstAidData[scenario].icon}"></i>
                  <span>${firstAidData[scenario].title}</span>
              `
        item.addEventListener("click", () => {
          showFirstAidInstructions(scenario)
        })
        recentItems.appendChild(item)
      }
    })
  }
  
  // Load custom contacts from localStorage
  function loadCustomContacts() {
    customContacts = JSON.parse(localStorage.getItem("customContacts")) || []
  }
  
  // Save custom contacts to localStorage
  function saveCustomContacts() {
    localStorage.setItem("customContacts", JSON.stringify(customContacts))
  }
  
  // Initialize all event listeners
  function initializeEventListeners() {
    // Emergency button
    document.getElementById("emergencyBtn").addEventListener("click", () => {
      new bootstrap.Modal(document.getElementById("emergencyModal")).show()
    })
  
    // Save offline button
    document.getElementById("saveOfflineBtn").addEventListener("click", handleOfflineSave)
  
    // Print button
    document.getElementById("printBtn").addEventListener("click", handlePrint)
  
    // Voice guidance button
    document.getElementById("voiceGuidanceBtn").addEventListener("click", toggleVoiceGuidance)
  
    // Voice search button
    document.getElementById("voiceSearchBtn").addEventListener("click", startVoiceSearch)
  
    // CPR timer buttons
    document.getElementById("startCprTimer").addEventListener("click", startCprTimer)
    document.getElementById("resetCprTimer").addEventListener("click", resetCprTimer)
  
    // Add contact button
    document.getElementById("addContactBtn").addEventListener("click", addCustomContact)
  
    // Copy location button
    document.getElementById("copyLocationBtn").addEventListener("click", copyLocationToClipboard)
  
    // Send SOS button
    document.getElementById("sendSOSBtn").addEventListener("click", sendSOSMessage)
  
    // Feedback buttons
    document.querySelectorAll(".feedback-btn").forEach((btn) => {
      btn.addEventListener("click", handleFeedback)
    })
  
    // Share buttons
    document.querySelectorAll(".share-btn").forEach((btn) => {
      btn.addEventListener("click", handleShare)
    })
  
    // First aid modal events
    document.getElementById("firstAidModal").addEventListener("hidden.bs.modal", () => {
      stopVoiceGuidance()
      resetCprTimer()
    })
  }
  
  // Initialize search functionality
  function initializeSearch() {
    const searchInput = document.getElementById("searchInput")
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase()
      filterCards(searchTerm)
    })
  }
  
  // Initialize category filters
  function initializeFilters() {
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"))
        e.target.classList.add("active")
        filterByCategory(e.target.dataset.category)
      })
    })
  }
  
  // Initialize language selector
  function initializeLanguageSelector() {
    const languageSelector = document.getElementById("languageSelector")
    if (languageSelector) {
      languageSelector.addEventListener("change", (e) => {
        currentLanguage = e.target.value
        updateLanguage()
      })
    }
  }
  
  // Update UI with selected language
  function updateLanguage() {
    const lang = translations[currentLanguage]
  
    // Update search placeholder
    document.getElementById("searchInput").placeholder = lang.search
  
    // Update category filter title
    document.querySelector(".category-filter h5").textContent = lang.filterByCategory
  
    // Update filter buttons
    const filterButtons = document.querySelectorAll(".filter-btn")
    filterButtons[0].textContent = lang.allCategories
    filterButtons[1].textContent = lang.injuries
    filterButtons[2].textContent = lang.medical
    filterButtons[3].textContent = lang.environmental
    filterButtons[4].textContent = lang.pediatric
    filterButtons[5].textContent = lang.cpr
  
    // Update recently viewed title
    document.querySelector("#recentlyViewed h5").textContent = lang.recentlyViewed
  
    // Update favorites title
    document.querySelector(".favorite-title h5").textContent = lang.favorites
  
    // Update modal elements if open
    if (currentScenario) {
      updateModalLanguage()
    }
  }
  
  // Update modal language
  function updateModalLanguage() {
    const lang = translations[currentLanguage]
  
    // Update feedback text
    document.querySelector(".feedback-container p").textContent = lang.wasHelpful
    document.querySelectorAll(".feedback-btn")[0].innerHTML = `<i class="bi bi-hand-thumbs-up-fill me-1"></i>${lang.yes}`
    document.querySelectorAll(".feedback-btn")[1].innerHTML = `<i class="bi bi-hand-thumbs-down-fill me-1"></i>${lang.no}`
  
    // Update share text
    document.querySelector(".share-options").previousElementSibling.textContent = lang.shareGuide
  
    // Update buttons
    document.getElementById("saveOfflineBtn").innerHTML = `<i class="bi bi-download me-2"></i>${lang.saveOffline}`
    document.querySelector(".modal-footer .btn-secondary").textContent = lang.close
  
    // Update navigation buttons if present
    const prevBtn = document.querySelector(".step-navigation .btn-secondary")
    const nextBtn = document.querySelector(".step-navigation .btn-primary")
    if (prevBtn) prevBtn.textContent = lang.previous
    if (nextBtn) nextBtn.textContent = lang.next
  
    // Update timer buttons if visible
    if (!document.getElementById("cprTimerContainer").classList.contains("d-none")) {
      document.getElementById("startCprTimer").innerHTML = `<i class="bi bi-play-fill me-1"></i>${lang.startTimer}`
      document.getElementById("resetCprTimer").innerHTML =
        `<i class="bi bi-arrow-counterclockwise me-1"></i>${lang.resetTimer}`
    }
  }
  
  // Populate First Aid Cards
  function populateFirstAidCards() {
    const firstAidList = document.getElementById("firstAidList")
    firstAidList.innerHTML = ""
  
    Object.entries(firstAidData).forEach(([key, data]) => {
      const card = createFirstAidCard(key, data)
      firstAidList.appendChild(card)
    })
  }
  
  // Populate favorites section
  function populateFavorites() {
    const favoritesList = document.getElementById("favoritesList")
    if (!favoritesList) return
  
    favoritesList.innerHTML = ""
  
    const bookmarkedItems = Object.entries(firstAidData).filter(([key, data]) => data.bookmarked)
  
    if (bookmarkedItems.length === 0) {
      document.getElementById("favoritesSection").style.display = "none"
      return
    }
  
    document.getElementById("favoritesSection").style.display = "block"
  
    bookmarkedItems.forEach(([key, data]) => {
      const col = document.createElement("div")
      col.className = "col-md-4"
  
      col.innerHTML = `
              <div class="first-aid-card h-100" data-scenario="${key}">
                  <div class="card-body p-3">
                      <div class="d-flex align-items-center mb-2">
                          <i class="bi ${data.icon} text-primary me-2"></i>
                          <h6 class="card-title mb-0">${data.title}</h6>
                      </div>
                      <button class="btn btn-sm btn-outline-danger remove-favorite" data-scenario="${key}">
                          <i class="bi bi-x-circle me-1"></i>Remove
                      </button>
                  </div>
              </div>
          `
  
      // Add click handlers
      const card = col.querySelector(".first-aid-card")
      card.addEventListener("click", (e) => {
        if (!e.target.closest(".remove-favorite")) {
          showFirstAidInstructions(key)
        }
      })
  
      const removeBtn = col.querySelector(".remove-favorite")
      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        toggleBookmark(key)
      })
  
      favoritesList.appendChild(col)
    })
  }
  
  // Create individual First Aid Card
  function createFirstAidCard(key, data) {
    const col = document.createElement("div")
    col.className = "col-md-6 col-lg-4"
  
    const urgencyClass = data.urgency === "critical" ? "border-danger" : "border-primary"
    const urgencyBadge =
      data.urgency === "critical"
        ? `<span class="badge bg-danger urgency-badge">Critical</span>`
        : `<span class="badge bg-primary urgency-badge">Important</span>`
  
    col.innerHTML = `
          <div class="first-aid-card ${urgencyClass} h-100" data-scenario="${key}" data-category="${data.category}">
              ${urgencyBadge}
              <button class="bookmark-btn" data-scenario="${key}">
                  <i class="bi ${data.bookmarked ? "bi-bookmark-fill" : "bi-bookmark"}"></i>
              </button>
              <div class="card-body p-4">
                  <div class="d-flex align-items-center mb-3">
                      <i class="bi ${data.icon} text-primary me-2" style="font-size: 1.5rem;"></i>
                      <h5 class="card-title mb-0">${data.title}</h5>
                  </div>
                  <p class="card-text text-white-50">Click for detailed instructions</p>
              </div>
          </div>
      `
  
    // Add click handlers
    const card = col.querySelector(".first-aid-card")
    card.addEventListener("click", (e) => {
      if (!e.target.closest(".bookmark-btn")) {
        showFirstAidInstructions(key)
      }
    })
  
    const bookmarkBtn = col.querySelector(".bookmark-btn")
    bookmarkBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      toggleBookmark(key)
    })
  
    return col
  }
  
  // Show First Aid Instructions
  function showFirstAidInstructions(scenario) {
    currentScenario = scenario
    currentStep = 0
    const data = firstAidData[scenario]
  
    // Add to recently viewed
    addToRecentlyViewed(scenario)
  
    // Set modal title
    document.getElementById("firstAidModalTitle").textContent = data.title
  
    // Create step indicators
    createStepIndicators(data.steps.length)
    // Create step indicators
    createStepIndicators(data.steps.length)
  
    // Show first step
    showStep(0)
  
    // Show/hide CPR timer
    const cprTimerContainer = document.getElementById("cprTimerContainer")
    if (data.useTimer) {
      cprTimerContainer.classList.remove("d-none")
    } else {
      cprTimerContainer.classList.add("d-none")
    }
  
    // Reset voice guidance
    voiceGuidanceActive = false
    document.getElementById("voiceGuidanceBtn").classList.remove("active")
  
    // Show modal
    new bootstrap.Modal(document.getElementById("firstAidModal")).show()
  }
  
  // Create step indicators
  function createStepIndicators(stepCount) {
    const stepIndicator = document.getElementById("stepIndicator")
    stepIndicator.innerHTML = ""
  
    for (let i = 0; i < stepCount; i++) {
      const dot = document.createElement("div")
      dot.className = i === 0 ? "step-dot active" : "step-dot"
      dot.dataset.step = i
      dot.addEventListener("click", () => showStep(i))
      stepIndicator.appendChild(dot)
    }
  }
  
  // Show specific step
  function showStep(stepIndex) {
    currentStep = stepIndex
    const data = firstAidData[currentScenario]
    const stepData = data.steps[stepIndex]
  
    // Update step indicators
    document.querySelectorAll(".step-dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === stepIndex)
    })
  
    // Create content
    const content = document.createElement("div")
    content.className = "step-content active"
  
    content.innerHTML = `
          <h4 class="mb-3">${stepData.title}</h4>
          <p>${stepData.content}</p>
          ${stepData.image ? `<img src="${stepData.image}" alt="${stepData.title}" class="image-guide">` : ""}
          ${
            stepIndex === data.steps.length - 1 && data.warnings && data.warnings.length > 0
              ? `<div class="alert alert-danger mt-3">
                  <strong>Warning:</strong>
                  <ul class="mb-0 mt-2">
                      ${data.warnings.map((warning) => `<li>${warning}</li>`).join("")}
                  </ul>
              </div>`
              : ""
          }
      `
  
    // Add navigation buttons
    const navigation = document.createElement("div")
    navigation.className = "step-navigation"
  
    if (stepIndex > 0) {
      const prevButton = document.createElement("button")
      prevButton.className = "btn btn-secondary"
      prevButton.textContent = translations[currentLanguage].previous
      prevButton.addEventListener("click", () => showStep(stepIndex - 1))
      navigation.appendChild(prevButton)
    } else {
      // Empty div for spacing
      const spacer = document.createElement("div")
      navigation.appendChild(spacer)
    }
  
    if (stepIndex < data.steps.length - 1) {
      const nextButton = document.createElement("button")
      nextButton.className = "btn btn-primary"
      nextButton.textContent = translations[currentLanguage].next
      nextButton.addEventListener("click", () => showStep(stepIndex + 1))
      navigation.appendChild(nextButton)
    } else if (data.quiz && data.quiz.length > 0) {
      const quizButton = document.createElement("button")
      quizButton.className = "btn btn-success"
      quizButton.innerHTML = '<i class="bi bi-question-circle me-1"></i>Take Quiz'
      quizButton.addEventListener("click", () => showQuiz())
      navigation.appendChild(quizButton)
    } else {
      // Empty div for spacing
      const spacer = document.createElement("div")
      navigation.appendChild(spacer)
    }
  
    content.appendChild(navigation)
  
    // Replace content
    const contentContainer = document.getElementById("firstAidModalContent")
    contentContainer.innerHTML = ""
    contentContainer.appendChild(content)
  
    // Speak content if voice guidance is active
    if (voiceGuidanceActive) {
      speakText(`Step ${stepIndex + 1}: ${stepData.title}. ${stepData.content}`)
    }
  }
  
  // Toggle bookmark status
  function toggleBookmark(scenario) {
    firstAidData[scenario].bookmarked = !firstAidData[scenario].bookmarked
    saveBookmarks()
    populateFirstAidCards()
    populateFavorites()
  }
  
  // Filter cards by search term
  function filterCards(searchTerm) {
    Object.entries(firstAidData).forEach(([key, data]) => {
      const card = document.querySelector(`[data-scenario="${key}"]`)
      if (!card) return
  
      const visible =
        data.title.toLowerCase().includes(searchTerm) ||
        data.steps.some(
          (step) => step.title.toLowerCase().includes(searchTerm) || step.content.toLowerCase().includes(searchTerm),
        )
      card.closest(".col-md-6").style.display = visible ? "block" : "none"
    })
  }
  
  // Filter by category
  function filterByCategory(category) {
    Object.entries(firstAidData).forEach(([key, data]) => {
      const card = document.querySelector(`[data-scenario="${key}"]`)
      if (!card) return
  
      const visible = category === "all" || data.category === category
      card.closest(".col-md-6").style.display = visible ? "block" : "none"
    })
  }
  
  // Handle offline saving
  function handleOfflineSave() {
    // Implementation for offline saving functionality
    const saveBtn = document.getElementById("saveOfflineBtn")
    saveBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Saved'
    saveBtn.classList.remove("btn-primary")
    saveBtn.classList.add("btn-success")
  
    // Save to localStorage
    const offlineGuides = JSON.parse(localStorage.getItem("offlineGuides")) || {}
    offlineGuides[currentScenario] = firstAidData[currentScenario]
    localStorage.setItem("offlineGuides", JSON.stringify(offlineGuides))
  
    setTimeout(() => {
      saveBtn.innerHTML = '<i class="bi bi-download me-2"></i>Save Offline'
      saveBtn.classList.remove("btn-success")
      saveBtn.classList.add("btn-primary")
    }, 2000)
  }
  
  // Handle print functionality
  function handlePrint() {
    const data = firstAidData[currentScenario]
    const printWindow = window.open("", "_blank")
  
    printWindow.document.write(`
          <html>
          <head>
              <title>${data.title} - First Aid Guide</title>
              <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; }
                  h1 { color: #0d6efd; }
                  h2 { color: #0d6efd; margin-top: 20px; }
                  .step { margin-bottom: 20px; }
                  .warnings { margin-top: 30px; background-color: #f8d7da; padding: 15px; border-radius: 5px; }
                  .warnings h3 { color: #842029; margin-top: 0; }
              </style>
          </head>
          <body>
              <h1>${data.title}</h1>
              
              <div class="steps">
                  ${data.steps
                    .map(
                      (step, index) => `
                      <div class="step">
                          <h2>Step ${index + 1}: ${step.title}</h2>
                          <p>${step.content}</p>
                      </div>
                  `,
                    )
                    .join("")}
              </div>
              
              ${
                data.warnings && data.warnings.length > 0
                  ? `
                  <div class="warnings">
                      <h3>Important Warnings</h3>
                      <ul>
                          ${data.warnings.map((warning) => `<li>${warning}</li>`).join("")}
                      </ul>
                  </div>
              `
                  : ""
              }
              
              <footer style="margin-top: 30px; font-size: 12px; color: #6c757d;">
                  Printed from HealthGuardian First Aid Guide
              </footer>
          </body>
          </html>
      `)
  
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }
  
  // CPR Timer functions
  function startCprTimer() {
    if (cprTimerInterval) {
      clearInterval(cprTimerInterval)
    }
  
    const startTime = Date.now()
    cprTimer = startTime
  
    const timerDisplay = document.getElementById("cprTimerDisplay")
    const progressBar = document.getElementById("cprProgressBar")
    const startBtn = document.getElementById("startCprTimer")
  
    startBtn.innerHTML = '<i class="bi bi-pause-fill me-1"></i>Pause'
    startBtn.classList.remove("btn-primary")
    startBtn.classList.add("btn-warning")
  
    // Toggle button function
    startBtn.onclick = pauseCprTimer
  
    cprTimerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const minutes = Math.floor(elapsed / 60)
      const seconds = elapsed % 60
  
      timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  
      // Update progress bar (assuming 2 minutes is standard CPR cycle)
      const progress = Math.min((elapsed / 120) * 100, 100)
      progressBar.style.width = `${progress}%`
  
      // Alert at 30-second intervals for rhythm
      if (elapsed % 30 === 0 && elapsed > 0) {
        playBeepSound()
      }
    }, 1000)
  }
  
  function pauseCprTimer() {
    clearInterval(cprTimerInterval)
    cprTimerInterval = null
  
    const startBtn = document.getElementById("startCprTimer")
    startBtn.innerHTML = '<i class="bi bi-play-fill me-1"></i>Resume'
    startBtn.classList.remove("btn-warning")
    startBtn.classList.add("btn-primary")
  
    // Toggle button function
    startBtn.onclick = resumeCprTimer
  }
  
  function resumeCprTimer() {
    const pauseTime = Date.now()
    const elapsedBeforePause = cprTimer ? pauseTime - cprTimer : 0
  
    startCprTimer()
  
    // Adjust the timer to account for the pause
    cprTimer = pauseTime - elapsedBeforePause
  }
  
  function resetCprTimer() {
    clearInterval(cprTimerInterval)
    cprTimerInterval = null
    cprTimer = null
  
    const timerDisplay = document.getElementById("cprTimerDisplay")
    const progressBar = document.getElementById("cprProgressBar")
    const startBtn = document.getElementById("startCprTimer")
  
    timerDisplay.textContent = "00:00"
    progressBar.style.width = "0%"
  
    startBtn.innerHTML = '<i class="bi bi-play-fill me-1"></i>Start'
    startBtn.classList.remove("btn-warning")
    startBtn.classList.add("btn-primary")
  
    // Reset button function
    startBtn.onclick = startCprTimer
  }
  
  function playBeepSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
  
    oscillator.type = "sine"
    oscillator.frequency.value = 800
    gainNode.gain.value = 0.5
  
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
  
    oscillator.start()
  
    setTimeout(() => {
      oscillator.stop()
    }, 200)
  }
  
  // Voice guidance functions
  function toggleVoiceGuidance() {
    voiceGuidanceActive = !voiceGuidanceActive
    const voiceBtn = document.getElementById("voiceGuidanceBtn")
  
    if (voiceGuidanceActive) {
      voiceBtn.classList.add("active")
      // Speak current step
      const data = firstAidData[currentScenario]
      const stepData = data.steps[currentStep]
      speakText(`Step ${currentStep + 1}: ${stepData.title}. ${stepData.content}`)
    } else {
      voiceBtn.classList.remove("active")
      stopVoiceGuidance()
    }
  }
  
  function speakText(text) {
    // Cancel any ongoing speech
    stopVoiceGuidance()
  
    // Create new speech utterance
    const utterance = new SpeechSynthesisUtterance(text)
  
    // Set language based on current selection
    utterance.lang = currentLanguage
  
    // Speak
    speechSynthesis.speak(utterance)
  }
  
  function stopVoiceGuidance() {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel()
    }
  }
  
  // Voice search function
  function startVoiceSearch() {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice search is not supported in your browser")
      return
    }
  
    const recognition = new webkitSpeechRecognition()
    recognition.lang = currentLanguage
    recognition.continuous = false
  
    const voiceSearchBtn = document.getElementById("voiceSearchBtn")
    voiceSearchBtn.innerHTML = '<i class="bi bi-mic-fill text-danger"></i>'
  
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      document.getElementById("searchInput").value = transcript
      filterCards(transcript.toLowerCase())
    }
  
    recognition.onend = () => {
      voiceSearchBtn.innerHTML = '<i class="bi bi-mic-fill"></i>'
    }
  
    recognition.start()
  }
  
  // Location detection
  function detectLocation() {
    const locationElement = document.getElementById("currentLocation")
    if (!locationElement) return
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude
          const longitude = position.coords.longitude
          locationElement.textContent = `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`
  
          // Optionally, reverse geocode to get address
          fetchLocationAddress(latitude, longitude)
        },
        (error) => {
          locationElement.textContent = `Unable to retrieve your location: ${error.message}`
        },
      )
    } else {
      locationElement.textContent = "Geolocation is not supported by your browser"
    }
  }
  
  // Fetch address from coordinates
  function fetchLocationAddress(latitude, longitude) {
    const locationElement = document.getElementById("currentLocation")
  
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.display_name) {
          locationElement.textContent = data.display_name
        }
      })
      .catch((error) => {
        console.error("Error fetching address:", error)
      })
  }
  
  // Copy location to clipboard
  function copyLocationToClipboard() {
    const locationText = document.getElementById("currentLocation").textContent
    navigator.clipboard
      .writeText(locationText)
      .then(() => {
        const copyBtn = document.getElementById("copyLocationBtn")
        copyBtn.innerHTML = '<i class="bi bi-check-circle me-1"></i>Copied'
        copyBtn.classList.remove("btn-outline-primary")
        copyBtn.classList.add("btn-success")
  
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="bi bi-clipboard me-1"></i>Copy Location'
          copyBtn.classList.remove("btn-success")
          copyBtn.classList.add("btn-outline-primary")
        }, 2000)
      })
      .catch((err) => {
        console.error("Failed to copy location: ", err)
      })
  }
  
  // Add custom contact
  function addCustomContact() {
    const nameInput = document.getElementById("contactName")
    const phoneInput = document.getElementById("contactPhone")
  
    const name = nameInput.value.trim()
    const phone = phoneInput.value.trim()
  
    if (!name || !phone) {
      alert("Please enter both name and phone number")
      return
    }
  
    // Add to contacts array
    customContacts.push({ name, phone })
    saveCustomContacts()
  
    // Add to UI
    const contactList = document.querySelector(".emergency-contact-list .list-group")
    const contactItem = document.createElement("a")
    contactItem.href = `tel:${phone}`
    contactItem.className = "list-group-item list-group-item-action bg-dark text-white"
    contactItem.innerHTML = `
          <i class="bi bi-person-fill me-2"></i>${name}
          <span class="float-end text-white-50">${phone}</span>
      `
    contactList.appendChild(contactItem)
  
    // Clear inputs
    nameInput.value = ""
    phoneInput.value = ""
  }
  
  // Send SOS message
  function sendSOSMessage() {
    const locationText = document.getElementById("currentLocation").textContent
    const message = `EMERGENCY: I need help at my location: ${locationText}`
  
    // Check if Web Share API is supported
    if (navigator.share) {
      navigator
        .share({
          title: "Emergency SOS",
          text: message,
        })
        .catch((error) => console.error("Error sharing:", error))
    } else {
      // Fallback for browsers that don't support Web Share API
      const sosBtn = document.getElementById("sendSOSBtn")
      sosBtn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Message Copied'
  
      navigator.clipboard
        .writeText(message)
        .then(() => {
          alert("Emergency message copied to clipboard. Please paste it into your messaging app to send.")
        })
        .catch((err) => {
          console.error("Failed to copy message: ", err)
        })
  
      setTimeout(() => {
        sosBtn.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2"></i>Send SOS Message'
      }, 3000)
    }
  }
  
  // Handle feedback
  function handleFeedback(e) {
    const feedbackType = e.target.closest(".feedback-btn").dataset.feedback
    const feedbackBtns = document.querySelectorAll(".feedback-btn")
  
    feedbackBtns.forEach((btn) => btn.classList.remove("active"))
    e.target.closest(".feedback-btn").classList.add("active")
  
    // Store feedback in localStorage
    const feedbacks = JSON.parse(localStorage.getItem("firstAidFeedback")) || {}
    feedbacks[currentScenario] = feedbackType
    localStorage.setItem("firstAidFeedback", JSON.stringify(feedbacks))
  
    // Thank the user
    const feedbackContainer = document.querySelector(".feedback-container")
    const thankYou = document.createElement("p")
    thankYou.className = "text-success mt-2"
    thankYou.textContent = "Thank you for your feedback!"
    feedbackContainer.appendChild(thankYou)
  
    setTimeout(() => {
      thankYou.remove()
    }, 3000)
  }
  
  // Handle sharing
  function handleShare(e) {
    e.preventDefault()
  
    const shareType = e.target.closest(".share-btn").classList.contains("share-whatsapp")
      ? "whatsapp"
      : e.target.closest(".share-btn").classList.contains("share-twitter")
        ? "twitter"
        : "email"
  
    const data = firstAidData[currentScenario]
    const title = data.title
    const text = `Check out this first aid guide for ${title}`
    const url = window.location.href
  
    let shareUrl
  
    switch (shareType) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent("First Aid Guide: " + title)}&body=${encodeURIComponent(text + "\n\n" + url)}`
        break
    }
  
    window.open(shareUrl, "_blank")
  }
  
  // Show quiz
  function showQuiz() {
    quizCurrentQuestion = 0
    const quizModal = new bootstrap.Modal(document.getElementById("quizModal"))
    showQuizQuestion(quizCurrentQuestion)
    quizModal.show()
  }
  
  // Show quiz question
  function showQuizQuestion(questionIndex) {
    const data = firstAidData[currentScenario]
    if (!data.quiz || questionIndex >= data.quiz.length) return
  
    const question = data.quiz[questionIndex]
  
    document.getElementById("quizQuestion").textContent = question.question
  
    const optionsContainer = document.getElementById("quizOptions")
    optionsContainer.innerHTML = ""
  
    question.options.forEach((option, index) => {
      const optionDiv = document.createElement("div")
      optionDiv.className = "quiz-option"
      optionDiv.textContent = option
      optionDiv.dataset.index = index
  
      optionDiv.addEventListener("click", () => {
        handleQuizAnswer(index, question.correctAnswer)
      })
  
      optionsContainer.appendChild(optionDiv)
    })
  
    // Hide result and next button
    document.getElementById("quizResult").classList.add("d-none")
    document.getElementById("nextQuestionBtn").classList.add("d-none")
  }
  
  // Handle quiz answer
  function handleQuizAnswer(selectedIndex, correctIndex) {
    const options = document.querySelectorAll(".quiz-option")
    const resultDiv = document.getElementById("quizResult")
    const nextBtn = document.getElementById("nextQuestionBtn")
  
    // Disable all options
    options.forEach((option) => {
      option.style.pointerEvents = "none"
    })
  
    // Mark correct and incorrect
    options.forEach((option, index) => {
      if (index === correctIndex) {
        option.classList.add("correct")
      } else if (index === selectedIndex) {
        option.classList.add("incorrect")
      }
    })
  
    // Show result
    resultDiv.classList.remove("d-none")
    if (selectedIndex === correctIndex) {
      resultDiv.innerHTML = '<div class="alert alert-success">Correct! Well done!</div>'
    } else {
      resultDiv.innerHTML = '<div class="alert alert-danger">Incorrect. The correct answer is highlighted.</div>'
    }
  
    // Show next button if there are more questions
    const data = firstAidData[currentScenario]
    if (quizCurrentQuestion < data.quiz.length - 1) {
      nextBtn.classList.remove("d-none")
      nextBtn.onclick = () => {
        quizCurrentQuestion++
        showQuizQuestion(quizCurrentQuestion)
      }
    }
  }
  
  // Service worker registration
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("ServiceWorker registration successful")
        })
        .catch((err) => {
          console.log("ServiceWorker registration failed: ", err)
        })
    })
  }
  
  