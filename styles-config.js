const DEFAULT_STYLE = {
    text: "#000000",
    logo: "#FFFFFF",
    borderClass: "",
    background: null
};

const SPECIAL_STYLES = [
    {
        artist: "tripleS",
        season: "Atom01",
        member: "TokyoHaus",
        collections: ["000Z"],
        style: {
            text: "#6289DF"
        }
    },
    
    {   //WHITE tripleS ATOM01
        artist: "tripleS",
        season: "Atom01",
        collections: ["301Z", "302Z", "303Z", "306Z", "307Z", "310Z", "311Z", "312Z", "313Z", "314Z", "315Z", "316Z", "317Z", "318Z", "319Z", "320Z", "323Z", "324Z", "325Z", "326Z", "327Z", "329Z", "331Z", "332Z", "333Z", "334Z"],
        style: {
            text: "#FFFFFF"
        }
    },
    
    {   //WHITE tripleS BINARY01
        artist: "tripleS",
        season: "Binary01",
        collections: ["302Z", "304Z", "305Z", "306Z", "307Z", "308Z", "309Z", "310Z", "311Z", "312Z", "313Z", "314Z", "315Z", "316Z", "317Z", "318Z", "319Z", "320Z", "321Z", "323Z", "324Z", "332Z", "333Z", "334Z", "335Z", "336Z", "337Z", "338Z", "339Z", "340Z", "341Z", "342Z", "343Z", "345Z", "346Z", "348Z", "350Z", "353Z", "354Z", "358Z"],
        style: {
            text: "#FFFFFF"
        }
    },

    {   //WHITE tripleS CREAM01
        artist: "tripleS",
        season: "Cream01",
        collections: ["301Z", "303Z", "304Z", "305Z", "308Z", "309A", "311Z", "312Z", "313Z", "315Z", "316Z", "317Z", "318Z", "322Z", "323Z", "330Z"],
        style: {
            text: "#FFFFFF"
        }
    },

    {   //WHITE tripleS DIVINE01
        artist: "tripleS",
        season: "Divine01",
        collections: ["301A", "302A", "303A", "311Z", "317Z", "318Z", "319Z", "322A", "323Z", "324Z", "325Z", "326Z", "333Z", "334A", "336Z", "337Z", "339Z", "340Z", "341Z", "342Z", "401A"],
        style: {
            text: "#FFFFFF"
        }
    },

    {   //WHITE tripleS EVER01
        artist: "tripleS",
        season: "Ever01",
        collections: ["313Z", "314Z", "315Z", "316Z", "317Z", "318Z", "319Z", "320Z", "322A", "323A", "324A", "325A", "326A", "327A", "332Z", "333Z", "337Z", "339Z", "340Z", "341Z", "343Z", "344Z", "351Z", "352Z", "355Z", "401A", "402Z"],
        style: {
            text: "#FFFFFF"
        }
    },

    {   //WHITE tripleS ATOM02
        artist: "tripleS",
        season: "Atom02",
        collections: ["301A", "302A", "303A", "304Z", "305A", "306A", "307A", "308A", "310Z", "311Z", "312Z", "322Z", "323Z", "325Z", "326Z", "327Z", "328Z", "330A", "331Z", "332Z", "333Z", "334Z", "336A", "337A", "338Z", "340Z", "341Z", "343Z", "345Z", "346Z", "347Z", "348Z", "357Z", "358Z", "359Z", "360Z", "366Z", "372Z", "373Z", "374Z", "377Z", "401A", "402Z", "403A"],
        style: {
            text: "#FFFFFF"
        }
    },

    {   //WHITE tripleS BINARY02
        artist: "tripleS",
        season: "Binary02",
        collections: ["301A", "307A", "308A", "313Z", "314Z", "316Z", "317Z", "318Z", "319Z", "320Z", "321Z", "322Z", "326Z", "327Z", "328Z", "329Z", "330Z", "331Z", "332Z", "334Z", "336Z", "359Z", "363Z", "401A", "402Z"],
        style: {
            text: "#FFFFFF"
        }
    },

    {   //WHITE tripleS CREAM02
        artist: "tripleS",
        season: "Cream02",
        collections: ["301A", "304A", "305A", "306A", "307A", "313Z", "314Z", "315Z", "316Z", "317Z", "318Z", "319Z", "401A", "402Z", "601A"],
        style: {
            text: "#FFFFFF"
        }
    },

    {   
        artist: "tripleS",
        season: "Atom01",
        collections: ["304Z", "305Z", "308Z", "309Z", "321Z", "322Z", "328Z", "330Z"],
        style: {
            text: "#2BA8A2"
        }
    },

    {   
        artist: "tripleS",
        season: "Binary01",
        collections: ["301Z", "303Z", "322Z", "344Z", "347Z", "349Z"],
        style: {
            text: "#2BA8A2"
        }
    },

    {   
        artist: "tripleS",
        season: "Cream01",
        collections: ["302Z"],
        style: {
            text: "#2BA8A2"
        }
    },

    {   //MEMBER ANNIV
        artist: "tripleS",
        season: "Binary01",
        members: ["HyeRin", "ChaeYeon", "YooYeon", "SooMin", "NaKyoung"],
        collections: ["325Z", "326Z"],
        style: {
            text: "#FFFFFF"
        }
    },

    {   //MEMBER ANNIV
        artist: "tripleS",
        season: "Cream01",
        member: "SoHyun",
        collections: ["306Z", "307Z"],
        style: {
            text: "#FFFFFF"
        }
    },

    {   //MEMBER ANNIV
        artist: "tripleS",
        season: "Ever01",
        member: "SoHyun",
        collections: ["310Z"],
        style: {
            text: "#FFFFFF"
        }
    },

    {
        artist: "tripleS",
        season: "Binary01",
        collections: ["328Z", "329Z", "330Z", "331Z"],
        style: {
            text: "#DC4628"
        }
    },

    {
        artist: "tripleS",
        season: "Cream01",
        members: ["SeoYeon", "HyeRin", "YuBin", "Kaede", "DaHyun", "Nien", "SoHyun", "Xinyu"],
        collections: ["314A"],
        style: {
            text: "#F0907A"
        }
    },

    {
        artist: "tripleS",
        season: "Cream01",
        members: ["JiWoo", "ChaeYeon", "YooYeon", "SooMin", "NaKyoung", "Kotone", "YeonJi", "Mayu"],
        collections: ["314A"],
        style: {
            text: "#FFFFFF"
        }
    },

    {
        artist: "tripleS",
        season: "Cream01",
        collections: ["319Z"],
        style: {
            text: "#462EA4"
        }
    },

    {
        artist: "tripleS",
        season: "Cream01",
        collections: ["320Z", "321Z"],
        style: {
            text: "#07328D"
        }
    },

    {
        artist: "tripleS",
        season: "Cream01",
        collections: ["324Z"],
        style: {
            text: "#CA9739"
        }
    },

    {
        artist: "tripleS",
        season: "Cream01",
        collections: ["326Z", "327Z"],
        style: {
            text: "#E24BAC"
        }
    },

    {
        artist: "tripleS",
        season: "Cream01",
        collections: ["331Z", "332Z"],
        style: {
            text: "#FFF3C0"
        }
    },

    {
        artist: "tripleS",
        season: "Divine01",
        collections: ["305A", "306A", "307A", "308A"],
        style: {
            text: "#003756"
        }
    },

    {
        artist: "tripleS",
        season: "Divine01",
        collections: ["310Z"],
        style: {
            text: "#F5D48F"
        }
    },

    {
        artist: "tripleS",
        season: "Divine01",
        collections: ["312Z"],
        style: {
            text: "#003D19"
        }
    },

    {
        artist: "tripleS",
        season: "Divine01",
        collections: ["313Z", "343Z"],
        style: {
            text: "#FF8BEB"
        }
    },

    {
        artist: "tripleS",
        season: "Divine01",
        collections: ["327Z"],
        style: {
            text: "#FF4399"
        }
    },

    {
        artist: "tripleS",
        season: "Divine01",
        members: ["HyeRin", "YooYeon", "YeonJi", "Nien","SoHyun", "Xinyu"],
        collections: ["328Z"],
        style: {
            text: "#FFFFFF"
        }
    },

    {
        artist: "tripleS",
        season: "Divine01",
        collections: ["331A", "332A"],
        style: {
            text: "#FFDD71"
        }
    },

    {
        artist: "tripleS",
        season: "Divine01",
        collections: ["338Z"],
        style: {
            text: "#BE5248"
        }
    },

    {
        artist: "tripleS",
        season: "Ever01",
        collections: ["301A", "302A", "303A"],
        style: {
            text: "#C5EDD2"
        }
    },

    {
        artist: "tripleS",
        season: "Ever01",
        collections: ["304A"],
        style: {
            text: "#FFF9DE"
        }
    },

    {
        artist: "tripleS",
        season: "Ever01",
        collections: ["305A", "306A", "307A", "308A"],
        style: {
            text: "#A12E29"
        }
    },

    {
        artist: "tripleS",
        season: "Ever01",
        collections: ["309A"],
        style: {
            text: "#462818"
        }
    },

    {
        artist: "tripleS",
        season: "Ever01",
        collections: ["311Z"],
        style: {
            text: "#FAD400"
        }
    },

    {
        artist: "tripleS",
        season: "Ever01",
        collections: ["312Z"],
        style: {
            text: "#723A02"
        }
    },

    {
        artist: "tripleS",
        season: "Ever01",
        collections: ["321Z"],
        style: {
            text: "#C4FFFF"
        }
    },

    {
        artist: "tripleS",
        season: "Ever01",
        collections: ["330Z", "331Z"],
        style: {
            text: "#FFFFC5"
        }
    },

    {
        artist: "tripleS",
        season: "Ever01",
        collections: ["338Z"],
        style: {
            text: "#07328D"
        }
    },

    {
        artist: "tripleS",
        season: "Ever01",
        collections: ["345A", "346A"],
        style: {
            text: "#6394E7"
        }
    },

    {
        artist: "tripleS",
        season: "Ever01",
        collections: ["347Z", "348Z", "349Z"],
        style: {
            text: "#E14BAB"
        }
    },

    {
        artist: "tripleS",
        season: "Ever01",
        collections: ["356Z", "357Z"],
        style: {
            text: "#2A7717"
        }
    },

    {
        artist: "tripleS",
        season: "Atom02",
        collections: ["309Z"],
        style: {
            text: "#0083CA"
        }
    },

    {
        artist: "tripleS",
        season: "Atom02",
        collections: ["314Z"],
        style: {
            text: "#1E306B"
        }
    },

    {
        artist: "tripleS",
        season: "Atom02",
        collections: ["315Z", "316Z", "317Z"],
        style: {
            text: "#004C42"
        }
    },

    {
        artist: "tripleS",
        season: "Atom02",
        collections: ["318Z"],
        style: {
            text: "#E6A1C5"
        }
    },

    {
        artist: "tripleS",
        season: "Atom02",
        collections: ["319Z"],
        style: {
            text: "#FFE295"
        }
    },

    {
        artist: "tripleS",
        season: "Atom02",
        collections: ["320Z"],
        style: {
            text: "#FF8BEB"
        }
    },

    {
        artist: "tripleS",
        season: "Atom02",
        collections: ["321Z"],
        style: {
            text: "#FFB1C7"
        }
    },

    {
        artist: "tripleS",
        season: "Atom02",
        collections: ["324Z", "375Z", "376Z"],
        style: {
            text: "#FAD400"
        }
    },

    {
        artist: "tripleS",
        season: "Atom02",
        collections: ["329Z"],
        style: {
            text: "#FA3B9F"
        }
    },

    {
        artist: "tripleS",
        season: "Atom02",
        collections: ["339Z"],
        style: {
            text: "#E83D6D"
        }
    },

    {
        artist: "tripleS",
        season: "Atom02",
        collections: ["342Z"],
        style: {
            text: "#00B600"
        }
    },

    {
        artist: "tripleS",
        season: "Atom02",
        collections: ["344Z"],
        style: {
            text: "#FF4399"
        }
    },

    {
        artist: "tripleS",
        season: "Atom02",
        collections: ["349A", "350A", "351A"],
        style: {
            text: "#FF007B"
        }
    },

    {
        artist: "tripleS",
        season: "Atom02",
        collections: ["352A"],
        style: {
            text: "#FFF9DE"
        }
    },

    {
        artist: "tripleS",
        season: "Atom02",
        collections: ["354Z"],
        style: {
            text: "#04B0CA"
        }
    },

    {
        artist: "tripleS",
        season: "Atom02",
        collections: ["355Z", "356Z"],
        style: {
            text: "#241714"
        }
    },

    {   
        artist: "tripleS",
        season: "Binary02",
        collections: ["302A"],
        style: {
            text: "#D783EC"
        }
    },

    {   
        artist: "tripleS",
        season: "Binary02",
        collections: ["309Z"],
        style: {
            text: "#EDD1F7"
        }
    },

    {   
        artist: "tripleS",
        season: "Binary02",
        collections: ["310A"],
        style: {
            text: "#C01920"
        }
    },

    {   
        artist: "tripleS",
        season: "Binary02",
        collections: ["311Z"],
        style: {
            text: "#FAA3EB"
        }
    },

    {   
        artist: "tripleS",
        season: "Binary02",
        collections: ["312Z"],
        style: {
            text: "#C4FFFF"
        }
    },

    {
        artist: "tripleS",
        season: "Binary02",
        collections: ["325Z", "335Z"],
        style: {
            text: "#FAD400"
        }
    },

    {
        artist: "tripleS",
        season: "Binary02",
        collections: ["333A"],
        style: {
            text: "#F2F7E7"
        }
    },

    {
        artist: "tripleS",
        season: "Binary02",
        collections: ["339A", "340A"],
        style: {
            text: "#CF88BD"
        }
    },

    {
        artist: "tripleS",
        season: "Binary02",
        collections: ["341Z", "342Z"],
        style: {
            text: "#545454"
        }
    },

    {
        artist: "tripleS",
        season: "Binary02",
        collections: ["343Z", "344Z", "345Z", "346Z"],
        style: {
            text: "#E14BAB"
        }
    },

    {
        artist: "tripleS",
        season: "Binary02",
        collections: ["347Z", "348Z"],
        style: {
            text: "#2A7717"
        }
    },

    {
        artist: "tripleS",
        season: "Binary02",
        members: ["SeoYeon", "NaKyoung", "DaHyun", "Kotone", "Nien", "SeoAh"],
        collections: ["353Z", "354Z", "355Z", "356Z"],
        style: {
            text: "#FAD400"
        }
    },

    {
        artist: "tripleS",
        season: "Binary02",
        members: ["HyeRin", "ChaeYeon", "YooYeon", "Xinyu", "Mayu", "ChaeWon"],
        collections: ["353Z", "354Z", "355Z", "356Z"],
        style: {
            text: "#FFFFFF"
        }
    },

    {
        artist: "tripleS",
        season: "Binary02",
        members: ["JiWoo", "SooMin", "YuBin", "YeonJi", "JooBin", "HaYeon"],
        collections: ["353Z", "354Z", "355Z", "356Z"],
        style: {
            text: "#1A5706"
        }
    },

    {
        artist: "tripleS",
        season: "Binary02",
        members: ["Kaede", "SoHyun", "Lynn", "ShiOn", "Sullin", "JiYeon"],
        collections: ["353Z", "354Z", "355Z", "356Z"],
        style: {
            text: "#28643A"
        }
    },

    {
        artist: "tripleS",
        season: "Binary02",
        collections: ["361Z", "362Z"],
        style: {
            text: "#FFF3C0"
        }
    },

    {
        artist: "tripleS",
        season: "Cream02",
        collections: ["066Z", "081Z", "082Z", "886Z"],
        style: {
            text: "#D5EBF6"
        }
    },

    {
        artist: "tripleS",
        season: "Cream02",
        collections: ["302A"],
        style: {
            text: "#4E4C4C"
        }
    },

    {
        artist: "tripleS",
        season: "Cream02",
        collections: ["303A"],
        style: {
            text: "#EAEAEA"
        }
    },

    {
        artist: "tripleS",
        season: "Cream02",
        collections: ["308Z"],
        style: {
            text: "#6C7380"
        }
    },

    {
        artist: "tripleS",
        season: "Cream02",
        collections: ["309Z"],
        style: {
            text: "#06141F"
        }
    },

    {
        artist: "tripleS",
        season: "Cream02",
        collections: ["310Z"],
        style: {
            text: "#FA3B9F"
        }
    },

    {
        artist: "tripleS",
        season: "Cream02",
        collections: ["311Z"],
        style: {
            text: "#FFB1C7"
        }
    },

    {
        artist: "tripleS",
        season: "Cream02",
        collections: ["312Z"],
        style: {
            text: "#6AFF8B"
        }
    },

    {
        artist: "tripleS",
        season: "Cream02",
        collections: ["320Z"],
        style: {
            text: "#FAD400"
        }
    },
];