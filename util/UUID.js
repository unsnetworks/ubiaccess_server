class UUID {
    static randomUUID = () => {
        let uuid = '';
        const hexChars = '0123456789abcdef';

        for (let i = 0; i < 32; i++) {
          uuid += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
        }

        uuid = uuid.substring(0, 8) + '-' + uuid.substring(8, 12) + '-' + uuid.substring(12, 16) + '-' + uuid.substring(16, 20) + '-' + uuid.substring(20, 32);

        return uuid;
    }

}

module.exports = UUID;