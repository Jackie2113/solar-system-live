const BASE = import.meta.env.BASE_URL || '/';

export const PLANETS_DATA = [
    { 
        name: "Mercury", radius: 0.8, distance: 15, period: 88, rotationPeriod: 1408, basePhase: 4.40, 
        eccentricity: 0.205, inclination: 7.0, texture: BASE + 'textures/mercury.jpg', 
        info: "CLASS: Terrestrial<br>GRAVITY: 3.7 m/s²<br>DAY: 58 Earth Days<br><br>The smallest planet, heavily cratered and completely devoid of atmosphere." 
    },
    { 
        name: "Venus", radius: 1.8, distance: 25, period: 225, rotationPeriod: -5832, basePhase: 3.16, 
        eccentricity: 0.006, inclination: 3.4, texture: BASE + 'textures/venus_surface.jpg', hasAtmosphere: true, atmosphereTexture: BASE + 'textures/venus_atmosphere.jpg',
        info: "CLASS: Terrestrial<br>GRAVITY: 8.8 m/s²<br>DAY: 243 Earth Days<br><br>Spins backwards on its axis. The hottest planet due to a runaway greenhouse effect." 
    },
    { 
        name: "Earth", radius: 2.0, distance: 35, period: 365.25, rotationPeriod: 24, basePhase: 1.75, 
        eccentricity: 0.016, inclination: 0.0, texture: BASE + 'textures/earth_day.jpg', 
        info: "CLASS: Terrestrial<br>GRAVITY: 9.8 m/s²<br>DAY: 24 Hours<br><br>Our home. The only known celestial body to harbor life, protected by a strong magnetic field." 
    }, 
    { 
        name: "Mars", radius: 1.2, distance: 45, period: 687, rotationPeriod: 24.6, basePhase: 6.20, 
        eccentricity: 0.093, inclination: 1.8, texture: BASE + 'textures/mars.jpg', 
        info: "CLASS: Terrestrial<br>GRAVITY: 3.7 m/s²<br>DAY: 24.6 Hours<br><br>The Red Planet. Home to Olympus Mons, the largest volcano in the solar system." 
    },
    { 
        name: "Jupiter", radius: 5.0, distance: 85, period: 4333, rotationPeriod: 9.9, basePhase: 0.59, 
        eccentricity: 0.048, inclination: 1.3, texture: BASE + 'textures/jupiter.jpg', 
        info: "CLASS: Gas Giant<br>GRAVITY: 24.7 m/s²<br>DAY: 9.9 Hours<br><br>The largest planet. Its Great Red Spot is a massive storm that has raged for centuries." 
    },
    { 
        name: "Saturn", radius: 4.0, distance: 130, period: 10759, rotationPeriod: 10.7, basePhase: 0.87, 
        eccentricity: 0.054, inclination: 2.5, texture: BASE + 'textures/saturn.jpg', hasRings: true, ringTexture: BASE + 'textures/saturn_ring.png', ringInner: 4.5, ringOuter: 8.0,
        info: "CLASS: Gas Giant<br>GRAVITY: 10.4 m/s²<br>DAY: 10.7 Hours<br><br>Adorned with a dazzling, complex system of icy rings." 
    },
    { 
        name: "Uranus", radius: 2.5, distance: 170, period: 30687, rotationPeriod: -17.2, basePhase: 5.48, 
        eccentricity: 0.047, inclination: 0.8, texture: BASE + 'textures/uranus.jpg', 
        info: "CLASS: Ice Giant<br>GRAVITY: 8.6 m/s²<br>DAY: 17.2 Hours<br><br>Rotates backwards at a nearly 90-degree angle from the plane of its orbit." 
    },
    { 
        name: "Neptune", radius: 2.4, distance: 210, period: 60190, rotationPeriod: 16.1, basePhase: 5.31, 
        eccentricity: 0.008, inclination: 1.8, texture: BASE + 'textures/neptune.jpg', 
        info: "CLASS: Ice Giant<br>GRAVITY: 11.1 m/s²<br>DAY: 16.1 Hours<br><br>Dark, cold, and whipped by supersonic winds." 
    }
];