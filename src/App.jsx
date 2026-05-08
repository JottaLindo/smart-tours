import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import {
  Bike,
  Home,
  MapPinned,
  Navigation,
  Ticket,
  User,
  LocateFixed,
  Play,
  Volume2,
  Route,
  ShoppingCart,
  Plus,
  Minus,
  Globe,
  ArrowLeft,
  Star,
  CheckCircle2,
  QrCode,
  Lock,
  CreditCard,
  Landmark,
  Mail,
  Phone,
} from "lucide-react";
import alfamaImg from "./assets/tours/alfama.jpg";
import ponteImg from "./assets/tours/ponte.jpg";
import miradouroImg from "./assets/tours/miradouro.jpg";
import "leaflet/dist/leaflet.css";
import "./App.css";
import logoImg from "./assets/logo.png";
import jeronimosImg from "./assets/tickets/jeronimos.jpg";
import belemImg from "./assets/tickets/belem.jpg";
import maatImg from "./assets/tickets/maat.jpg";

const BIKE_PRICE = 12.99;
const STORAGE_KEY = "smart_tours_v3_orders";
const ACCOUNT_KEY = "smart_tours_v3_account";
const TOUR_ACCESS_KEY = "smart_tours_v3_access_email";

const PAYMENT_DETAILS = {
  mbway: { label: "MB WAY", value: "913836678" },
  paypal: { label: "PayPal", value: "smarttours@gmail.com" },
  transfer: { label: "Transferência Bancária", value: "PT50003501590009183663055" },
};

const translations = {
  pt: {
    home: "Home",
    map: "Mapa",
    tours: "Tours",
    tickets: "Bilhetes",
    profile: "Perfil",
    cart: "Carrinho",
    startTour: "Iniciar",
    navigating: "A navegar",
    directions: "Direções",
    locationActive: "Localização ativa. Segue a rota no mapa.",
    locationAsk: "Permite acesso à localização para usar o guia ao vivo.",
    ready: "Pronto para começar",
    unlockGuide: "Guia bloqueado",
    unlockText: "Para abrir o mapa deste tour, introduz o email usado no pagamento.",
    validateAccess: "Verificar compra do tour",
    accessDenied: "Este email ainda não tem uma compra ativa para este tour.",
    accessGranted: "Compra verificada. Já podes iniciar o guia.",
    exploreTitle: "Descobre Lisboa de bicicleta",
    exploreText: "Explore Lisboa ao seu ritmo com rotas interativas, aluguer de bicicletas e bilhetes digitais para as principais atrações da cidade.",
    viewTours: "Ver Tours",
    viewTickets: "Comprar Bilhetes",
    allTours: "Tours disponíveis",
    addCart: "Adicionar",
    openMap: "Abrir guia",
    from: "A partir de",
    stops: "paragens",
    people: "Pessoas",
    rentBikes: "Alugar bicicletas",
    bikeInfo: "12,99€ por pessoa",
    maxBikes: "Máximo igual ao nº de pessoas",
    total: "Total",
    checkout: "Check-out",
    name: "Nome completo",
    email: "Email",
    phone: "Telefone",
    finishOrder: "Confirmar compra",
    cartTitle: "Carrinho",
    emptyCart: "O carrinho está vazio.",
    touristTickets: "Bilhetes turísticos",
    ticketText: "Compra entradas para atrações em Lisboa e recebe acesso por QR Code.",
    buyTicket: "Comprar bilhete",
    activeAccess: "Os meus acessos",
    noAccess: "Ainda não tens acessos ativos.",
    profileTitle: "A tua conta Smart Tours",
    profileText: "Guarda os teus tours, bilhetes e acessos. Depois da compra, o mapa fica desbloqueado com o teu email.",
    createAccount: "Criar conta",
    paymentMethod: "Método de pagamento",
    confirmPayment: "Confirmo que realizei o pagamento",
    sendPayment: "Envia o pagamento e confirma abaixo para ativar o acesso.",
    accountCreated: "Conta criada",
    myOrders: "Compras",
  },
  en: {
    home: "Home",
    map: "Map",
    tours: "Tours",
    tickets: "Tickets",
    profile: "Profile",
    cart: "Cart",
    startTour: "Start",
    navigating: "Navigating",
    directions: "Directions",
    locationActive: "Location active. Follow the route on the map.",
    locationAsk: "Allow location access to use the live guide.",
    ready: "Ready to start",
    unlockGuide: "Guide locked",
    unlockText: "To open this tour map, enter the email used at checkout.",
    validateAccess: "Verify tour purchase",
    accessDenied: "This email does not have an active purchase for this tour yet.",
    accessGranted: "Purchase verified. You can now start the guide.",
    exploreTitle: "Discover Lisbon by bike",
    exploreText: "Explore Lisbon at your own pace with interactive routes, bike rental and digital tickets for the city’s top attractions.",
    viewTours: "View Tours",
    viewTickets: "Buy Tickets",
    allTours: "Available tours",
    addCart: "Add",
    openMap: "Open guide",
    from: "From",
    stops: "stops",
    people: "People",
    rentBikes: "Rent bicycles",
    bikeInfo: "€12.99 per person",
    maxBikes: "Maximum equal to people",
    total: "Total",
    checkout: "Checkout",
    name: "Full name",
    email: "Email",
    phone: "Phone",
    finishOrder: "Confirm purchase",
    cartTitle: "Cart",
    emptyCart: "Your cart is empty.",
    touristTickets: "Tourist tickets",
    ticketText: "Buy tickets for Lisbon attractions and get access by QR Code.",
    buyTicket: "Buy ticket",
    activeAccess: "My access",
    noAccess: "You do not have active access yet.",
    profileTitle: "Your Smart Tours account",
    profileText: "Save your tours, tickets and access. After purchase, the map is unlocked with your email.",
    createAccount: "Create account",
    paymentMethod: "Payment method",
    confirmPayment: "I confirm that I made the payment",
    sendPayment: "Send the payment and confirm below to activate access.",
    accountCreated: "Account created",
    myOrders: "Orders",
  },
};

const tours = [
  {
    id: 1,
    title: { pt: "Lisboa Histórica", en: "Historic Lisbon" },
    duration: { pt: "3 horas", en: "3 hours" },
    price: 19.99,
    rating: 4.9,
    reviews: 1247,
    category: { pt: "História", en: "History" },
    image: alfamaImg,
    description: {
      pt: "Sé, Alfama, miradouros e Praça do Comércio num percurso clássico e fácil de seguir.",
      en: "Cathedral, Alfama, viewpoints and Commerce Square in a classic and easy-to-follow route.",
    },
    stops: [
      { id: 1, name: { pt: "Sé de Lisboa", en: "Lisbon Cathedral" }, coords: [38.70974, -9.13269], text: { pt: "A Sé de Lisboa é a catedral mais antiga da cidade e um dos pontos históricos mais importantes da capital.", en: "Lisbon Cathedral is the oldest cathedral in the city and one of its most important historic landmarks." } },
      { id: 2, name: { pt: "Miradouro de Santa Luzia", en: "Santa Luzia Viewpoint" }, coords: [38.71179, -9.12938], text: { pt: "Um dos miradouros mais bonitos de Lisboa, com vista para Alfama e para o rio Tejo.", en: "One of Lisbon’s most beautiful viewpoints, overlooking Alfama and the Tagus River." } },
      { id: 3, name: { pt: "Portas do Sol", en: "Portas do Sol" }, coords: [38.71228, -9.12943], text: { pt: "Um ponto perfeito para fotografias e para perceber a beleza do bairro de Alfama.", en: "A perfect photo stop and one of the best places to enjoy Alfama’s beauty." } },
      { id: 4, name: { pt: "Alfama", en: "Alfama" }, coords: [38.71082, -9.12904], text: { pt: "Um dos bairros mais autênticos de Lisboa, conhecido pelas ruas estreitas e pelo fado.", en: "One of Lisbon’s most authentic neighborhoods, known for narrow streets and fado music." } },
      { id: 5, name: { pt: "Praça do Comércio", en: "Commerce Square" }, coords: [38.70778, -9.13659], text: { pt: "Uma das praças mais importantes de Lisboa, aberta ao rio Tejo e cheia de história.", en: "One of Lisbon’s most important squares, facing the Tagus River and full of history." } },
    ],
  },
  {
    id: 2,
    title: { pt: "Belém & Marginal", en: "Belém & Riverside" },
    duration: { pt: "4 horas", en: "4 hours" },
    price: 24.99,
    rating: 4.8,
    reviews: 892,
    category: { pt: "Cultura", en: "Culture" },
    image: ponteImg,
    description: {
      pt: "Percurso junto ao Tejo com Jerónimos, Padrão dos Descobrimentos, Torre de Belém e MAAT.",
      en: "Riverside route with Jerónimos, Discoveries Monument, Belém Tower and MAAT.",
    },
    stops: [
      { id: 1, name: { pt: "Mosteiro dos Jerónimos", en: "Jerónimos Monastery" }, coords: [38.69789, -9.20668], text: { pt: "Um dos monumentos mais importantes de Portugal e símbolo da época dos Descobrimentos.", en: "One of Portugal’s most important monuments and a symbol of the Age of Discoveries." } },
      { id: 2, name: { pt: "Pastéis de Belém", en: "Pastéis de Belém" }, coords: [38.69717, -9.2035], text: { pt: "Paragem clássica para provar um dos doces mais famosos de Lisboa.", en: "A classic stop to taste one of Lisbon’s most famous pastries." } },
      { id: 3, name: { pt: "Padrão dos Descobrimentos", en: "Discoveries Monument" }, coords: [38.69358, -9.20566], text: { pt: "Monumento dedicado às figuras ligadas à expansão marítima portuguesa.", en: "A monument dedicated to the figures connected to Portuguese maritime expansion." } },
      { id: 4, name: { pt: "Torre de Belém", en: "Belém Tower" }, coords: [38.69158, -9.216], text: { pt: "Um dos monumentos mais reconhecidos de Lisboa e paragem obrigatória em Belém.", en: "One of Lisbon’s most recognizable monuments and a must-see stop in Belém." } },
      { id: 5, name: { pt: "MAAT", en: "MAAT" }, coords: [38.69585, -9.1947], text: { pt: "Museu moderno junto ao rio, perfeito para fechar o percurso com arquitetura contemporânea.", en: "A modern riverside museum, perfect to end the route with contemporary architecture." } },
    ],
  },
  {
    id: 3,
    title: { pt: "Miradouros de Lisboa", en: "Lisbon Viewpoints" },
    duration: { pt: "5 horas", en: "5 hours" },
    price: 29.99,
    rating: 4.9,
    reviews: 756,
    category: { pt: "Vistas", en: "Views" },
    image: miradouroImg,
    description: {
      pt: "Percurso panorâmico pelos melhores miradouros e zonas altas da cidade.",
      en: "Panoramic route through Lisbon’s best viewpoints and hilltop areas.",
    },
    stops: [
      { id: 1, name: { pt: "Miradouro da Graça", en: "Graça Viewpoint" }, coords: [38.71688, -9.13236], text: { pt: "Vista ampla sobre o centro histórico e o Castelo de São Jorge.", en: "Wide view over the historic center and São Jorge Castle." } },
      { id: 2, name: { pt: "Senhora do Monte", en: "Senhora do Monte" }, coords: [38.71921, -9.13367], text: { pt: "Um dos pontos mais altos e impressionantes para observar Lisboa.", en: "One of the highest and most impressive places to view Lisbon." } },
      { id: 3, name: { pt: "São Pedro de Alcântara", en: "São Pedro de Alcântara" }, coords: [38.71547, -9.1446], text: { pt: "Miradouro clássico com vista sobre a Baixa e o Castelo.", en: "Classic viewpoint overlooking downtown Lisbon and the castle." } },
    ],
  },
];

const touristTickets = [
  {
    id: "jeronimos-ticket",
    title: {
      pt: "Mosteiro dos Jerónimos",
      en: "Jerónimos Monastery",
    },
    description: {
      pt: "Entrada digital com QR Code para um dos monumentos mais emblemáticos de Lisboa.",
      en: "Digital QR Code ticket for one of Lisbon’s most iconic monuments.",
    },
    price: 18,
    type: {
      pt: "Bilhete QR",
      en: "QR Ticket",
    },
    image: jeronimosImg,
  },

  {
    id: "belem-ticket",
    title: {
      pt: "Torre de Belém",
      en: "Belém Tower",
    },
    description: {
      pt: "Bilhete rápido com acesso digital à famosa Torre de Belém.",
      en: "Fast digital access ticket for the famous Belém Tower.",
    },
    price: 12,
    type: {
      pt: "Bilhete QR",
      en: "QR Ticket",
    },
    image: belemImg,
  },

  {
    id: "maat-ticket",
    title: {
      pt: "MAAT Museu",
      en: "MAAT Museum",
    },
    description: {
      pt: "Explore arte, arquitetura e tecnologia num dos museus mais modernos de Lisboa.",
      en: "Explore art, architecture and technology in one of Lisbon’s most modern museums.",
    },
    price: 11,
    type: {
      pt: "Museu",
      en: "Museum",
    },
    image: maatImg,
  },
];

const stopIcon = new L.DivIcon({
  html: `<div class="stop-marker"></div>`,
  className: "",
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const userIcon = new L.DivIcon({
  html: `<div class="user-marker"></div>`,
  className: "",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function Recenter({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) map.setView(position, 16, { animate: true });
  }, [position, map]);

  return null;
}

function fakeQrText(text) {
  return btoa(text).slice(0, 18).toUpperCase();
}

function App() {
  const [page, setPage] = useState("home");
  const [language, setLanguage] = useState("pt");
  const [selectedTour, setSelectedTour] = useState(tours[0]);
  const [activeStop, setActiveStop] = useState(tours[0].stops[0]);
  const [userPosition, setUserPosition] = useState(null);
  const [tourStarted, setTourStarted] = useState(false);
  const [status, setStatus] = useState("");
  const [cart, setCart] = useState([]);
  const [accessEmail, setAccessEmail] = useState(localStorage.getItem(TOUR_ACCESS_KEY) || "");
const checkoutNameRef = useRef(null);
const checkoutEmailRef = useRef(null);
const checkoutPhoneRef = useRef(null);

const accountNameRef = useRef(null);
const accountEmailRef = useRef(null);
const accountPhoneRef = useRef(null);
const accountCountryRef = useRef(null);
const accountDialCodeRef = useRef(null);
const accountAvatarRef = useRef(null);

const [avatarPreview, setAvatarPreview] = useState("");

const [isEditingAccount, setIsEditingAccount] = useState(false);

  const [checkout, setCheckout] = useState({
    name: "",
    email: "",
    phone: "",
    paymentMethod: "mbway",
    paymentConfirmed: false,
  });

  const [orders, setOrders] = useState(() =>
    JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  );

  const [account, setAccount] = useState(() =>
    JSON.parse(localStorage.getItem(ACCOUNT_KEY) || "null")
  );

  const t = translations[language];

  const routeCoords = useMemo(
    () => selectedTour.stops.map((stop) => stop.coords),
    [selectedTour]
  );

  const activeTourAccess = orders.some(
    (order) =>
      order.kind === "tour" &&
      order.tourId === selectedTour.id &&
      order.email.toLowerCase() === accessEmail.trim().toLowerCase()
  );

  const addTourToCart = (tour) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.kind === "tour" && item.id === tour.id);
      if (exists) return prev;
      return [...prev, { kind: "tour", ...tour, people: 1, bikes: 0 }];
    });

    setPage("cart");
  };

  const addTicketToCart = (ticket) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.kind === "ticket" && item.id === ticket.id);
      if (exists) return prev;
      return [...prev, { kind: "ticket", ...ticket, quantity: 1 }];
    });

    setPage("cart");
  };

  const updatePeople = (id, value) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.kind !== "tour" || item.id !== id) return item;

        const people = Math.max(1, Math.min(5, value));

        return {
          ...item,
          people,
          bikes: Math.min(item.bikes, people),
        };
      })
    );
  };

  const updateBikes = (id, value) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.kind !== "tour" || item.id !== id) return item;

        return {
          ...item,
          bikes: Math.max(0, Math.min(item.people, value)),
        };
      })
    );
  };

  const updateTicketQty = (id, value) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.kind !== "ticket" || item.id !== id) return item;

        return {
          ...item,
          quantity: Math.max(1, Math.min(10, value)),
        };
      })
    );
  };

  const itemTotal = (item) => {
    if (item.kind === "tour") {
      return item.price * item.people + item.bikes * BIKE_PRICE;
    }

    return item.price * item.quantity;
  };

  const total = cart.reduce((sum, item) => sum + itemTotal(item), 0);

  const startTour = () => {
    if (!activeTourAccess) {
      setStatus(t.accessDenied);
      return;
    }

    setTourStarted(true);
    setStatus(t.locationAsk);

    if (!navigator.geolocation) {
      setStatus(language === "pt" ? "GPS indisponível neste dispositivo." : "GPS unavailable on this device.");
      return;
    }

    navigator.geolocation.watchPosition(
      (position) => {
        const coords = [position.coords.latitude, position.coords.longitude];
        setUserPosition(coords);
        setStatus(t.locationActive);
      },
      () => {
        setStatus(t.locationAsk);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );
  };

  const validateAccess = () => {
    localStorage.setItem(TOUR_ACCESS_KEY, accessEmail);

    const hasAccess = orders.some(
      (order) =>
        order.kind === "tour" &&
        order.tourId === selectedTour.id &&
        order.email.toLowerCase() === accessEmail.trim().toLowerCase()
    );

    setStatus(hasAccess ? t.accessGranted : t.accessDenied);
  };

  const openTourMap = (tour) => {
    setSelectedTour(tour);
    setActiveStop(tour.stops[0]);
    setStatus("");
    setTourStarted(false);
    setPage("map");
  };

  const speakStop = () => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const voice = new SpeechSynthesisUtterance(activeStop.text[language]);
    voice.lang = language === "pt" ? "pt-PT" : "en-US";
    voice.rate = 0.95;

    window.speechSynthesis.speak(voice);
  };

  const openGoogleMaps = () => {
    const [lat, lng] = activeStop.coords;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
  };

const handleAvatarChange = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    setAvatarPreview(reader.result);
  };

  reader.readAsDataURL(file);
};

const createAccount = () => {
  const name = accountNameRef.current?.value?.trim() || "";
  const email = accountEmailRef.current?.value?.trim() || "";
  const phone = accountPhoneRef.current?.value?.trim() || "";
  const country = accountCountryRef.current?.value || "Portugal";
  const dialCode = accountDialCodeRef.current?.value || "+351";

  if (!name || !email) return;

  const newAccount = {
    name,
    email,
    phone,
    country,
    dialCode,
    fullPhone: phone ? `${dialCode} ${phone}` : "",
    avatar: avatarPreview || account?.avatar || "",
    createdAt: account?.createdAt || new Date().toLocaleDateString("pt-PT"),
  };

  setAccount(newAccount);
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(newAccount));
  setIsEditingAccount(false);

  console.log("Novo utilizador registado:", newAccount);
};

const logoutAccount = () => {
  setAccount(null);
  setIsEditingAccount(false);
  localStorage.removeItem(ACCOUNT_KEY);
};

const finishOrder = () => {
  const name = checkoutNameRef.current?.value?.trim() || "";
  const email = checkoutEmailRef.current?.value?.trim() || "";
  const phone = checkoutPhoneRef.current?.value?.trim() || "";

  if (!name || !email || cart.length === 0 || !checkout.paymentConfirmed) {
    return;
  }

  const newOrders = cart.map((item) => {
    if (item.kind === "tour") {
      return {
        orderId: `${Date.now()}-${item.id}`,
        kind: "tour",
        tourId: item.id,
        title: item.title[language],
        email,
        phone,
        people: item.people,
        bikes: item.bikes,
        total: itemTotal(item),
        paymentMethod: checkout.paymentMethod,
        date: new Date().toLocaleDateString("pt-PT"),
      };
    }

    return {
      orderId: `${Date.now()}-${item.id}`,
      kind: "ticket",
      ticketId: item.id,
      title: item.title[language],
      email,
      phone,
      quantity: item.quantity,
      total: itemTotal(item),
      paymentMethod: checkout.paymentMethod,
      qr: fakeQrText(`${item.id}-${email}-${Date.now()}`),
      date: new Date().toLocaleDateString("pt-PT"),
    };
  });

  const updated = [...orders, ...newOrders];

  setOrders(updated);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  localStorage.setItem(TOUR_ACCESS_KEY, email);

  setAccessEmail(email);
  setCart([]);

  setCheckout({
    name: "",
    email: "",
    phone: "",
    paymentMethod: "mbway",
    paymentConfirmed: false,
  });

  setPage("profile");
};

// eslint-disable-next-line react/no-unstable-nested-components
  const BottomNav = ({ floating = false }) => (
    <div className={`bottom-nav ${floating ? "floating" : ""}`}>
      <button onClick={() => setPage("home")} className={page === "home" ? "active" : ""}>
        <Home size={21} />
        <span>{t.home}</span>
      </button>

      <button onClick={() => setPage("map")} className={page === "map" ? "active" : ""}>
        <MapPinned size={21} />
        <span>{t.map}</span>
      </button>

      <button onClick={() => setPage("tours")} className={page === "tours" ? "active" : ""}>
        <Bike size={21} />
        <span>{t.tours}</span>
      </button>

      <button onClick={() => setPage("tickets")} className={page === "tickets" ? "active" : ""}>
        <Ticket size={21} />
        <span>{t.tickets}</span>
      </button>

      <button onClick={() => setPage("profile")} className={page === "profile" ? "active" : ""}>
        <User size={21} />
        <span>{t.profile}</span>
      </button>
    </div>
  );

// eslint-disable-next-line react/no-unstable-nested-components
  const Layout = ({ children }) => (
    <div className="app-shell">
      <div className="app-top">
        <div className="brand-area">
          <img src={logoImg} alt="Smart Tours" className="brand-logo-main" />

          <div className="brand-texts">
            <h1>Smart Tours</h1>
            <span>Discover Lisbon by Bike</span>
          </div>
        </div>

        <button onClick={() => setLanguage(language === "pt" ? "en" : "pt")}>
          <Globe size={19} />
          {language.toUpperCase()}
        </button>
      </div>

      <div className="app-content">{children}</div>

      <BottomNav />
    </div>
  );

// eslint-disable-next-line react/no-unstable-nested-components
  const HomePage = () => (
    <Layout>
      <section className="home-hero">
        <div className="home-overlay">
          <div className="hero-badge">
            <Bike size={18} />
            Smart Tours Lisboa
          </div>

          <h2>{t.exploreTitle}</h2>
          <p>{t.exploreText}</p>

          <div className="hero-actions">
            <button onClick={() => setPage("tours")}>{t.viewTours}</button>
            <button onClick={() => setPage("tickets")}>{t.viewTickets}</button>
          </div>
        </div>
      </section>

      <section className="benefits-grid">
        <div>
          <MapPinned size={22} />
          <span>{language === "pt" ? "Rotas selecionadas" : "Selected routes"}</span>
        </div>

        <div>
          <Navigation size={22} />
          <span>{language === "pt" ? "Guia no telemóvel" : "Mobile guide"}</span>
        </div>

        <div>
          <QrCode size={22} />
          <span>{language === "pt" ? "Bilhetes por QR" : "QR tickets"}</span>
        </div>
      </section>

      <section className="section-head">
        <h3>{t.allTours}</h3>
        <button onClick={() => setPage("tours")}>{t.viewTours}</button>
      </section>

      <div className="horizontal-tours">
        {tours.map((tour) => (
          <article key={tour.id} className="mini-tour" onClick={() => openTourMap(tour)}>
            <img src={tour.image} alt={tour.title[language]} />
            <strong>{tour.title[language]}</strong>
            <span>{tour.price.toFixed(2)}€</span>
          </article>
        ))}
      </div>
    </Layout>
  );

// eslint-disable-next-line react/no-unstable-nested-components
  const ToursPage = () => (
    <Layout>
      <section className="page-list">
        <h2>{t.allTours}</h2>

        {tours.map((tour) => (
          <article key={tour.id} className="tour-item">
            <img src={tour.image} alt={tour.title[language]} />

            <div className="tour-item-body">
              <div className="tour-meta">
                <span>{tour.category[language]}</span>
                <span>
                  <Star size={14} fill="currentColor" /> {tour.rating}
                </span>
              </div>

              <h3>{tour.title[language]}</h3>
              <p>{tour.description[language]}</p>

              <div className="tour-info-row">
                <span>
                  <Route size={15} />
                  {tour.stops.length} {t.stops}
                </span>

                <span>
                  <Bike size={15} />
                  {t.bikeInfo}
                </span>
              </div>

              <div className="tour-footer">
                <strong>
                  {t.from} {tour.price.toFixed(2)}€
                </strong>

                <button onClick={() => addTourToCart(tour)}>{t.addCart}</button>
              </div>

              <button className="ghost-btn" onClick={() => openTourMap(tour)}>
                {t.openMap}
              </button>
            </div>
          </article>
        ))}
      </section>
    </Layout>
  );

// eslint-disable-next-line react/no-unstable-nested-components
  const TouristTicketsPage = () => (
    <Layout>
      <section className="page-list">
        <h2>{t.touristTickets}</h2>
        <p className="page-intro">{t.ticketText}</p>

        <div className="tickets-grid">
          {touristTickets.map((ticket) => (
            <article key={ticket.id} className="ticket-card-big">
              <img src={ticket.image} alt={ticket.title[language]} className="ticket-image" />

              <div className="ticket-overlay">
                <div className="ticket-content">
                  <h2 className="ticket-title">{ticket.title[language]}</h2>

                  <p className="ticket-description">
                    {ticket.description?.[language]}
                  </p>

                  <div className="ticket-bottom">
                    <span className="ticket-price">{ticket.price.toFixed(2)}€</span>

                    <button
                      className="ticket-button"
                      onClick={() => addTicketToCart(ticket)}
                    >
                      {t.buyTicket}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );

  const MapPage = () => (
    <div className="map-screen">
      <MapContainer
        center={selectedTour.stops[0].coords}
        zoom={15}
        className="map"
        zoomControl={false}
      >
        <TileLayer
          attribution="OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Polyline
          positions={routeCoords}
          pathOptions={{ color: "#16a34a", weight: 6 }}
        />

        {selectedTour.stops.map((stop) => [
          <Marker
            key={`marker-${stop.id}`}
            position={stop.coords}
            icon={stopIcon}
            eventHandlers={{ click: () => setActiveStop(stop) }}
          >
            <Popup>{stop.name[language]}</Popup>
          </Marker>,

          <Circle
            key={`circle-${stop.id}`}
            center={stop.coords}
            radius={70}
            pathOptions={{
              color: "#16a34a",
              fillColor: "#16a34a",
              fillOpacity: 0.08,
            }}
          />,
        ])}

        {userPosition && (
          <>
            <Marker position={userPosition} icon={userIcon}>
              <Popup>{language === "pt" ? "A tua localização" : "Your location"}</Popup>
            </Marker>

            <Recenter position={userPosition} />
          </>
        )}
      </MapContainer>

      <div className="map-top">
        <button onClick={() => setPage("tours")}>
          <ArrowLeft size={20} />
        </button>

        <div>
          <p>Smart Tours</p>
          <h1>{selectedTour.title[language]}</h1>
        </div>

        <button onClick={startTour}>
          <LocateFixed size={20} />
        </button>
      </div>

      {!activeTourAccess ? (
        <div className="access-card locked">
          <div className="lock-icon">
            <Lock size={28} />
          </div>

          <h2>{t.unlockGuide}</h2>
          <p>{t.unlockText}</p>

          <input
            value={accessEmail}
            onChange={(e) => setAccessEmail(e.target.value)}
            placeholder="Email"
          />

          <button onClick={validateAccess}>{t.validateAccess}</button>

          <small>{status}</small>
        </div>
      ) : (
        <div className="tour-card">
          <div className="card-header">
            <div>
              <span>
                {language === "pt" ? "Paragem" : "Stop"} {activeStop.id} de{" "}
                {selectedTour.stops.length}
              </span>

              <h2>{activeStop.name[language]}</h2>
            </div>

            <button onClick={speakStop}>
              <Volume2 size={20} />
            </button>
          </div>

          <p>{activeStop.text[language]}</p>

          <div className="actions">
            <button className="primary" onClick={startTour}>
              <Play size={18} />
              {tourStarted ? t.navigating : t.startTour}
            </button>

            <button className="secondary" onClick={openGoogleMaps}>
              <Navigation size={18} />
              {t.directions}
            </button>
          </div>

          <div className="status">
            <Route size={16} />
            {status || t.ready}
          </div>
        </div>
      )}

      <BottomNav floating />
    </div>
  );

// eslint-disable-next-line react/no-unstable-nested-components
  const CartPage = () => (
    <Layout>
      <section className="page-list">
        <h2>{t.cartTitle}</h2>

        {cart.length === 0 ? (
          <div className="empty-box">{t.emptyCart}</div>
        ) : (
          <>
            {cart.map((item) => (
              <article key={`${item.kind}-${item.id}`} className="cart-item">
                <h3>{item.title[language]}</h3>

                {item.kind === "tour" ? (
                  <>
                    <p>{item.description[language]}</p>

                    <div className="bike-row">
                      <div>
                        <strong>{t.people}</strong>
                        <span>{item.price.toFixed(2)}€ / pessoa</span>
                      </div>

                      <div className="qty">
                        <button onClick={() => updatePeople(item.id, item.people - 1)}>
                          <Minus size={15} />
                        </button>
                        <strong>{item.people}</strong>
                        <button onClick={() => updatePeople(item.id, item.people + 1)}>
                          <Plus size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="bike-row">
                      <div>
                        <strong>{t.rentBikes}</strong>
                        <span>
                          {t.maxBikes} • {BIKE_PRICE.toFixed(2)}€
                        </span>
                      </div>

                      <div className="qty">
                        <button onClick={() => updateBikes(item.id, item.bikes - 1)}>
                          <Minus size={15} />
                        </button>
                        <strong>{item.bikes}</strong>
                        <button onClick={() => updateBikes(item.id, item.bikes + 1)}>
                          <Plus size={15} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bike-row">
                    <div>
                      <strong>{item.type[language]}</strong>
                      <span>QR Code</span>
                    </div>

                    <div className="qty">
                      <button onClick={() => updateTicketQty(item.id, item.quantity - 1)}>
                        <Minus size={15} />
                      </button>
                      <strong>{item.quantity}</strong>
                      <button onClick={() => updateTicketQty(item.id, item.quantity + 1)}>
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                )}

                <div className="cart-line-total">
                  <span>{t.total}</span>
                  <strong>{itemTotal(item).toFixed(2)}€</strong>
                </div>
              </article>
            ))}

            <div className="checkout-box">
              <div>
                <span>{t.total}</span>
                <strong>{total.toFixed(2)}€</strong>
              </div>
              <button onClick={() => setPage("checkout")}>{t.checkout}</button>
            </div>
          </>
        )}
      </section>
    </Layout>
  );

// eslint-disable-next-line react/no-unstable-nested-components
  // eslint-disable-next-line react/no-unstable-nested-components
const CheckoutPage = () => {
  const payment = PAYMENT_DETAILS[checkout.paymentMethod];

  return (
    <Layout>
      <section className="page-list">
        <h2>{t.checkout}</h2>

        <input
          ref={checkoutNameRef}
          placeholder={t.name}
          defaultValue=""
          autoComplete="name"
        />

        <input
          ref={checkoutEmailRef}
          placeholder={t.email}
          defaultValue=""
          type="email"
          autoComplete="email"
        />

        <input
          ref={checkoutPhoneRef}
          placeholder={t.phone}
          defaultValue=""
          type="tel"
          autoComplete="tel"
        />

        <div className="payment-box">
          <h3>{t.paymentMethod}</h3>

          <div className="payment-options">
            <button
              className={checkout.paymentMethod === "mbway" ? "active" : ""}
              onClick={() =>
                setCheckout({
                  ...checkout,
                  paymentMethod: "mbway",
                  paymentConfirmed: false,
                })
              }
            >
              MB WAY
            </button>

            <button
              className={checkout.paymentMethod === "paypal" ? "active" : ""}
              onClick={() =>
                setCheckout({
                  ...checkout,
                  paymentMethod: "paypal",
                  paymentConfirmed: false,
                })
              }
            >
              PayPal
            </button>

            <button
              className={checkout.paymentMethod === "transfer" ? "active" : ""}
              onClick={() =>
                setCheckout({
                  ...checkout,
                  paymentMethod: "transfer",
                  paymentConfirmed: false,
                })
              }
            >
              Banco
            </button>
          </div>

          <div className="payment-details">
            <span>{payment.label}</span>
            <strong>{payment.value}</strong>
            <p>
              {t.sendPayment} <b>{total.toFixed(2)}€</b>
            </p>
          </div>

          <label className="confirm-payment">
            <input
              type="checkbox"
              checked={checkout.paymentConfirmed}
              onChange={(e) =>
                setCheckout({
                  ...checkout,
                  paymentConfirmed: e.target.checked,
                })
              }
            />
            <span>{t.confirmPayment}</span>
          </label>
        </div>

        <button className="primary-btn" onClick={finishOrder}>
          {t.finishOrder}
        </button>
      </section>
    </Layout>
  );
};
  
const COUNTRY_OPTIONS = [
  { country: "Portugal", code: "+351", flag: "🇵🇹" },
  { country: "Espanha", code: "+34", flag: "🇪🇸" },
  { country: "França", code: "+33", flag: "🇫🇷" },
  { country: "Reino Unido", code: "+44", flag: "🇬🇧" },
  { country: "Alemanha", code: "+49", flag: "🇩🇪" },
  { country: "Itália", code: "+39", flag: "🇮🇹" },
  { country: "Brasil", code: "+55", flag: "🇧🇷" },
  { country: "Estados Unidos", code: "+1", flag: "🇺🇸" },
  { country: "Canadá", code: "+1", flag: "🇨🇦" },
  { country: "Países Baixos", code: "+31", flag: "🇳🇱" },
  { country: "Bélgica", code: "+32", flag: "🇧🇪" },
  { country: "Suíça", code: "+41", flag: "🇨🇭" },
];

// eslint-disable-next-line react/no-unstable-nested-components
  // eslint-disable-next-line react/no-unstable-nested-components
const ProfilePage = () => {
  const tourOrders = orders.filter((order) => order.kind === "tour");
  const ticketOrders = orders.filter((order) => order.kind === "ticket");

  const showAccountForm = !account || isEditingAccount;

  return (
    <Layout>
      {showAccountForm ? (
        <section className="profile-hero">
          <div className="profile-avatar-wrap">
            {avatarPreview || account?.avatar ? (
              <img
                src={avatarPreview || account?.avatar}
                alt="Foto de perfil"
                className="profile-avatar-img"
              />
            ) : (
              <div className="profile-icon">
                <User size={34} />
              </div>
            )}

            <label className="avatar-upload-btn">
              {language === "pt" ? "Mudar foto" : "Change photo"}
              <input
                ref={accountAvatarRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                hidden
              />
            </label>
          </div>

          <h2>
            {!account
              ? t.createAccount
              : language === "pt"
              ? "Editar conta"
              : "Edit account"}
          </h2>

          <p>{t.profileText}</p>

          <div className="account-form">
            <input
              ref={accountNameRef}
              placeholder={t.name}
              defaultValue={account?.name || ""}
              autoComplete="name"
            />

            <input
              ref={accountEmailRef}
              placeholder={t.email}
              defaultValue={account?.email || ""}
              type="email"
              autoComplete="email"
            />

            <select
              ref={accountCountryRef}
              defaultValue={account?.country || "Portugal"}
              className="profile-select"
            >
              {COUNTRY_OPTIONS.map((item) => (
                <option key={item.country} value={item.country}>
                  {item.flag} {item.country}
                </option>
              ))}
            </select>

            <div className="phone-row">
              <select
                ref={accountDialCodeRef}
                defaultValue={account?.dialCode || "+351"}
                className="dial-select"
              >
                {COUNTRY_OPTIONS.map((item) => (
                  <option key={`${item.country}-${item.code}`} value={item.code}>
                    {item.flag} {item.code}
                  </option>
                ))}
              </select>

              <input
                ref={accountPhoneRef}
                placeholder={t.phone}
                defaultValue={account?.phone || ""}
                type="tel"
                autoComplete="tel"
              />
            </div>

            <button className="primary-btn" onClick={createAccount}>
              {!account
                ? t.createAccount
                : language === "pt"
                ? "Guardar alterações"
                : "Save changes"}
            </button>

            {account ? (
              <button
                className="secondary-profile-btn"
                onClick={() => {
                  setIsEditingAccount(false);
                  setAvatarPreview("");
                }}
              >
                {language === "pt" ? "Cancelar" : "Cancel"}
              </button>
            ) : null}
          </div>
        </section>
      ) : (
        <>
          <section className="profile-hero">
            {account.avatar ? (
              <img
                src={account.avatar}
                alt="Foto de perfil"
                className="profile-avatar-img big"
              />
            ) : (
              <div className="profile-icon">
                <User size={34} />
              </div>
            )}

            <h2>{account.name}</h2>
            <p>{account.email}</p>

            {account.fullPhone ? <p>{account.fullPhone}</p> : null}
            {account.country ? <p>{account.country}</p> : null}

            <div className="profile-stats">
              <div>
                <strong>{tourOrders.length}</strong>
                <span>Tours</span>
              </div>

              <div>
                <strong>{ticketOrders.length}</strong>
                <span>QR Tickets</span>
              </div>
            </div>

            <div className="profile-actions">
              <button
                className="primary-btn"
                onClick={() => {
                  setAvatarPreview(account?.avatar || "");
                  setIsEditingAccount(true);
                }}
              >
                {language === "pt" ? "Editar informações" : "Edit information"}
              </button>

              <button className="logout-btn" onClick={logoutAccount}>
                {language === "pt" ? "Terminar sessão" : "Logout"}
              </button>
            </div>
          </section>

          <section className="page-list compact">
            <h2>{t.activeAccess}</h2>

            {orders.length === 0 ? (
              <div className="empty-box">{t.noAccess}</div>
            ) : (
              <>
                {tourOrders.map((order) => (
                  <article key={order.orderId} className="ticket-card">
                    <CheckCircle2 size={28} />

                    <div>
                      <h3>{order.title}</h3>
                      <p>{order.email}</p>
                      <span>
                        {order.people} pessoa(s) • {order.bikes} bicicleta(s)
                      </span>
                    </div>
                  </article>
                ))}

                {ticketOrders.map((order) => (
                  <article key={order.orderId} className="qr-ticket-card">
                    <div>
                      <h3>{order.title}</h3>
                      <p>{order.email}</p>
                      <span>{order.quantity} bilhete(s)</span>
                    </div>

                    <div className="fake-qr">
                      <QrCode size={42} />
                      <small>{order.qr}</small>
                    </div>
                  </article>
                ))}
              </>
            )}
          </section>
        </>
      )}
    </Layout>
  );
};

  if (page === "map") return <MapPage />;
  if (page === "tours") return <ToursPage />;
  if (page === "tickets") return <TouristTicketsPage />;
  if (page === "cart") return <CartPage />;
  if (page === "checkout") return <CheckoutPage />;
  if (page === "profile") return <ProfilePage />;
  return <HomePage />;
}

export default App;