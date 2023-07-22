export class UserGenerator {
    static get CITIES() {
        return [
            {
                country: 'Afghanistan',
                names: ['Kabul']
            },
            {
                country: 'Brazil',
                names: ['Rio de Janeiro', 'Sao Paulo']
            },
            {
                country: 'France',
                names: ['Paris', 'Marseille']
            },
            {
                country: 'Germany',
                names: ['Berlin', 'Munich', 'Coburg']
            },
            {
                country: 'India',
                names: ['Mumbai', 'Delhi']
            },
            {
                country: 'Japan',
                names: ['Tokyo', 'Kawasaki']
            },
            {
                country: 'Mexico',
                names: ['Mexico City']
            },
            {
                country: 'Russia',
                names: ['Moscow', 'Kazan']
            },
            {
                country: 'Spain',
                names: ['Barcelona', 'Madrid']
            },
            {
                country: 'Turkey',
                names: ['Ankara', 'Istanbul']
            },
            {
                country: '대한민국',
                names: ['서울', '부산', '인천', '대구']
            },
        ]
    }
    static get REGOINS() {
        return ['north', 'west', 'south', 'east']
    }
    // usersKeys = ['name', 'age', 'country', 'city', 'region']
    generateUsers(amount) {
        const users = [];

        while (users.length < amount) {
            const country = this.generateRandomCountry()
            users.push({
                name: this.generateRandomName(),
                age: this.generateRandomAge(100),
                country: country,
                city: this.generateRandomCity(country),
                region: this.generateRandomRegion(),
            });
        }

        return users
    }
    generateRandomName() {
        const adjectives = ['happy', 'sad', 'funny', 'serious', 'clever', 'wise', 'kind', 'brave', 'honest', 'loyal'];
        const nouns = ['cat', 'dog', 'bird', 'tree', 'book', 'flower', 'mountain', 'river', 'ocean', 'planet', '강민주'];
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        return `${randomAdjective}-${randomNoun}`;
    }
    generateRandomAge(maxAge) {
        return Math.floor(Math.random() * maxAge);
    }
    generateRandomCountry() {
        const countries = [];
        UserGenerator.CITIES.forEach((city) => {
            countries.push(city.country)
        })
        return countries[Math.floor(Math.random() * countries.length)];
    }
    generateRandomCity(country) {
        let citiesByCountry = UserGenerator.CITIES.find((city) => city.country === country).names;
        return citiesByCountry[Math.floor(Math.random() * citiesByCountry.length)]
    }
    generateRandomRegion() {
        return UserGenerator.REGOINS[Math.floor(Math.random() * UserGenerator.REGOINS.length)]
    }
}