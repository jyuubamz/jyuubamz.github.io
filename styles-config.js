const DEFAULT_STYLE = {
    text: "#000000",
    logo: "#000000"
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

    {   //WHITE ARTMS ATOM01
        artist: "ARTMS",
        season: "Atom01",
        collections: ["303Z", "305Z", "306Z", "307Z", "308Z", "309Z", "310Z", "311Z", "312Z", "313Z", "314Z", "322Z", "323Z", "324Z", "325Z", "328Z", "329Z", "334Z", "335Z", "336Z", "337A", "338Z", "339A", "342Z", "343Z", "344Z", "347Z", "348Z", "349Z", "350Z", "351Z"],
        style: {
            text: "#FFFFFF"
        }
    },

    {   //WHITE ARTMS BINARY01
        artist: "ARTMS",
        season: "Binary01",
        collections: ["309Z", "311Z"],
        style: {
            text: "#FFFFFF"
        }
    },

    {   //WHITE ARTMS CREAM01
        artist: "ARTMS",
        season: "Cream01",
        collections: ["302Z", "303Z", "304Z", "305Z", "306Z", "307Z", "308Z", "309A", "310A", "311A", "312A", "313A", "314A", "315A", "316A", "326Z", "327Z", "328Z", "329Z", "330Z", "331Z", "332Z", "336Z", "337Z", "338Z", "342A", "343A", "344A", "345A", "346A", "347A", "348A", "349A", "350A", "353Z", "356Z", "357Z", "358Z", "401Z"],
        style: {
            text: "#FFFFFF"
        }
    },

    {   //WHITE ARTMS DIVINE01
        artist: "ARTMS",
        season: "Divine01",
        collections: ["301A", "302A", "303A", "308Z", "309Z", "310Z", "311Z", "313Z", "319Z", "321Z", "325Z", "344A", "345A", "346A", "401A"],
        style: {
            text: "#FFFFFF"
        }
    },

    {   //WHITE ARTMS EVER01
        artist: "ARTMS",
        season: "Ever01",
        collections: ["302Z", "303A", "304A", "305A", "306A", "307Z", "308Z", "309Z", "310Z", "320Z", "321Z", "322Z", "332Z", "333Z", "334Z", "335Z", "336Z", "338Z", "339Z", "340Z", "401Z"],
        style: {
            text: "#FFFFFF"
        }
    },

    {   //WHITE ARTMS ATOM02
        artist: "ARTMS",
        season: "Atom02",
        collections: ["304Z", "305Z", "306Z", "307Z", "309Z", "310Z", "311Z", "312Z", "313Z", "314Z", "315Z", "316Z", "317Z", "318Z", "319Z", "320Z", "321Z", "322Z", "323Z", "324Z", "325Z", "326Z", "401Z"],
        style: {
            text: "#FFFFFF"
        }
    },

    {   
        artist: "idntt",
        collections: ["200Z"],
        style: {
            text: "#FFFFFF",
            logo: "#FFFFFF"
        }
    },

    {
        artist: "idntt",
        season: "Summer25",
        collections: ["202A"],
        style: {
            borderClass: "omaborder",
            text: "#ffffff",
            logo: "#FFFFFF",
            background: 'url("omaborder.png") no-repeat center / cover'
        }
    },

    {
        artist: "idntt",
        season: "Winter26",
        collections: ["201A"],
        style: {
            borderClass: "omaborder",
            text: "#ffffff",
            logo: "#FFFFFF",
            background: 'url("omaborder.png") no-repeat center / cover'
        }
    },

    {
        artist: "idntt",
        season: "Summer26",
        collections: ["201A", "402A"],
        style: {
            borderClass: "omaborder",
            text: "#ffffff",
            logo: "#FFFFFF",
            background: 'url("omaborder.png") no-repeat center / cover'
        }
    },

    {   
        artist: "idntt",
        collections: ["301Z","302Z"],
        style: {
            borderClass: "scoborder",
            background: 'url("scoborder.png") no-repeat center / cover'
        }
    },

    {   
        artist: "idntt",
        collections: ["401Z"],
        style: {
            borderClass: "ucoborder",
            background: 'url("ucoborder.png") no-repeat center / cover'
        }
    },

    {   //WHITE idntt Spring25
        artist: "idntt",
        season: "Spring25",
        collections: ["201Z", "202Z", "203Z", "204Z", "205Z", "206Z", "207Z", "208Z", "209Z", "210Z", "211Z", "212Z", "213Z", "214Z", "215Z", "216Z", "217Z", "218Z", "219Z", "220Z", "221Z", "222Z", "223Z", "224Z", "225Z"],
        style: {
            text: "#FFFFFF",
            logo: "#FFFFFF"
        }
    },

    {   //WHITE idntt Summer25
        artist: "idntt",
        season: "Summer25",
        collections: ["203A", "204A", "205A", "214A", "215A", "218Z", "219Z"],
        style: {
            text: "#FFFFFF",
            logo: "#FFFFFF"
        }
    },

    {   //WHITE idntt Autumn25
        artist: "idntt",
        season: "Autumn25",
        collections: ["202Z", "203Z", "204Z", "214Z"],
        style: {
            text: "#FFFFFF",
            logo: "#FFFFFF"
        }
    },

    {   //WHITE idntt Winter26
        artist: "idntt",
        season: "Winter26",
        collections: ["202A", "203A", "204A", "213A", "214A", "216Z", "220Z", "228Z", "229Z"],
        style: {
            text: "#FFFFFF",
            logo: "#FFFFFF"
        }
    },

    {   //WHITE idntt Spring26
        artist: "idntt",
        season: "Spring26",
        collections: ["219Z"],
        style: {
            text: "#FFFFFF",
            logo: "#FFFFFF"
        }
    },

    {   //WHITE idntt Summer26
        artist: "idntt",
        season: "Summer26",
        collections: ["202A", "203A", "208A", "209A", "210A", "211A"],
        style: {
            text: "#FFFFFF",
            logo: "#FFFFFF"
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
        collections: ["325Z"],
        style: {
            text: "#F7F9F3"
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

    {
        artist: "ARTMS",
        season: "Atom01",
        collections: ["304Z"],
        style: {
            text: "#2DA8A1"
        }
    },

    {   
        artist: "ARTMS",
        season: "Atom01",
        collections: ["326Z", "327Z"],
        style: {
            text: "#2BA8A2"
        }
    },

    {   
        artist: "ARTMS",
        season: "Atom01",
        collections: ["330Z", "331Z", "332Z", "333Z"],
        style: {
            text: "#2F2725"
        }
    },

    {   
        artist: "ARTMS",
        season: "Atom01",
        collections: ["340Z", "341Z"],
        style: {
            text: "#E293B5"
        }
    },

    {   
        artist: "ARTMS",
        season: "Binary01",
        collections: ["304A", "305A", "306A", "307A"],
        style: {
            text: "#46117F"
        }
    },

    {   
        artist: "ARTMS",
        season: "Binary01",
        collections: ["308Z"],
        style: {
            text: "#C7E8FF"
        }
    },

    {   
        artist: "ARTMS",
        season: "Binary01",
        collections: ["310Z"],
        style: {
            text: "#532AAD"
        }
    },

    {   
        artist: "ARTMS",
        season: "Binary01",
        collections: ["312Z", "313A"],
        style: {
            text: "#E1CFFF"
        }
    },

    {   
        artist: "ARTMS",
        season: "Binary01",
        collections: ["314Z", "315Z", "316Z"],
        style: {
            text: "#1D71A0"
        }
    },

    {   
        artist: "ARTMS",
        season: "Binary01",
        collections: ["317Z"],
        style: {
            text: "#2B3D58"
        }
    },

    {   
        artist: "ARTMS",
        season: "Binary01",
        collections: ["318Z", "319Z"],
        style: {
            text: "#FF008A"
        }
    },

    {   
        artist: "ARTMS",
        season: "Binary01",
        collections: ["320Z", "321Z", "323Z", "324Z", "325Z", "326Z"],
        style: {
            text: "#BDD8FF"
        }
    },

    {   
        artist: "ARTMS",
        season: "Binary01",
        collections: ["322Z"],
        style: {
            text: "#92D5FB"
        }
    },

    {   
        artist: "ARTMS",
        season: "Cream01",
        collections: ["301A"],
        style: {
            text: "#2863AF"
        }
    },

    {   
        artist: "ARTMS",
        season: "Cream01",
        collections: ["333Z"],
        style: {
            text: "#570D08"
        }
    },

    {   
        artist: "ARTMS",
        season: "Cream01",
        collections: ["334Z", "335Z"],
        style: {
            text: "#5B4938"
        }
    },

    {   
        artist: "ARTMS",
        season: "Cream01",
        collections: ["339Z", "340Z", "341Z"],
        style: {
            text: "#E192B4"
        }
    },

    {   
        artist: "ARTMS",
        season: "Cream01",
        collections: ["351A"],
        style: {
            text: "#91CDF1"
        }
    },

    {   
        artist: "ARTMS",
        season: "Cream01",
        collections: ["352Z"],
        style: {
            text: "#2D77FF"
        }
    },

    {   
        artist: "ARTMS",
        season: "Cream01",
        collections: ["354Z", "355Z"],
        style: {
            text: "#FBFAD7"
        }
    },

    {   
        artist: "ARTMS",
        season: "Cream01",
        collections: ["359Z"],
        style: {
            text: "#3286F9"
        }
    },

    {   
        artist: "ARTMS",
        season: "Divine01",
        collections: ["304A", "305A", "306A", "307A"],
        style: {
            text: "#EAE9E8"
        }
    },

    {   
        artist: "ARTMS",
        season: "Divine01",
        collections: ["312Z"],
        style: {
            text: "#16A987"
        }
    },

    {   
        artist: "ARTMS",
        season: "Divine01",
        collections: ["314Z", "315Z", "316Z", "317Z", "322Z", "323Z", "324Z"],
        style: {
            text: "#1D71A0"
        }
    },

    {   
        artist: "ARTMS",
        season: "Divine01",
        collections: ["318Z"],
        style: {
            text: "#FFE52B"
        }
    },

    {   
        artist: "ARTMS",
        season: "Divine01",
        collections: ["320Z"],
        style: {
            text: "#D9D9D6"
        }
    },

    {   
        artist: "ARTMS",
        season: "Divine01",
        collections: ["326Z"],
        style: {
            text: "#F7F9F3"
        }
    },

    {   
        artist: "ARTMS",
        season: "Divine01",
        collections: ["331Z"],
        style: {
            text: "#4C6F24"
        }
    },

    {   
        artist: "ARTMS",
        season: "Divine01",
        collections: ["336A"],
        style: {
            text: "#F3E6E6"
        }
    },

    {   
        artist: "ARTMS",
        season: "Divine01",
        collections: ["337Z"],
        style: {
            text: "#F9B2B5"
        }
    },

    {   
        artist: "ARTMS",
        season: "Divine01",
        collections: ["338Z"],
        style: {
            text: "#BBD0F8"
        }
    },

    {   
        artist: "ARTMS",
        season: "Divine01",
        collections: ["339Z"],
        style: {
            text: "#E8D1FD"
        }
    },

    {   
        artist: "ARTMS",
        season: "Divine01",
        collections: ["340Z"],
        style: {
            text: "#FAD5EC"
        }
    },

    {   
        artist: "ARTMS",
        season: "Divine01",
        collections: ["341Z", "342Z", "343Z"],
        style: {
            text: "#F6FBD8"
        }
    },

    {   
        artist: "ARTMS",
        season: "Divine01",
        collections: ["347Z"],
        style: {
            text: "#F7F9F3"
        }
    },

    {   
        artist: "ARTMS",
        season: "Ever01",
        collections: ["301A"],
        style: {
            text: "#131D4B"
        }
    },

    {   
        artist: "ARTMS",
        season: "Ever01",
        collections: ["316Z", "317Z", "318Z", "319Z"],
        style: {
            text: "#F0CA66"
        }
    },

    {   
        artist: "ARTMS",
        season: "Ever01",
        collections: ["323Z", "324Z", "325Z", "326Z"],
        style: {
            text: "#E192B4"
        }
    },

    {   
        artist: "ARTMS",
        season: "Ever01",
        collections: ["327Z", "328Z", "329Z"],
        style: {
            text: "#767675"
        }
    },

    {   
        artist: "ARTMS",
        season: "Ever01",
        collections: ["330Z", "331Z"],
        style: {
            text: "#FBFAD7"
        }
    },

    {   
        artist: "idntt",
        season: "Summer25",
        collections: ["217A", "227Z"],
        style: {
            text: "#F18900",
            logo: "#F18900"
        }
    },

    {   
        artist: "idntt",
        season: "Summer25",
        collections: ["222Z", "223Z", "224Z", "225Z"],
        style: {
            text: "#FB79FD",
            logo: "#FB79FD"
        }
    },

    {   
        artist: "idntt",
        season: "Summer25",
        collections: ["226Z"],
        style: {
            text: "#F7F9F3",
            logo: "#F7F9F3"
        }
    },

    {   
        artist: "idntt",
        season: "Autumn25",
        collections: ["205Z", "206Z", "207Z", "208Z"],
        style: {
            text: "#A4E1FF",
            logo: "#A4E1FF"
        }
    },

    {   
        artist: "idntt",
        season: "Autumn25",
        collections: ["209Z"],
        style: {
            text: "#EB611B",
            logo: "#EB611B"
        }
    },

    {   
        artist: "idntt",
        season: "Winter26",
        collections: ["219A"],
        style: {
            text: "#004489",
            logo: "#004489"
        }
    },

    {   
        artist: "idntt",
        season: "Winter26",
        collections: ["221Z"],
        style: {
            text: "#136D55",
            logo: "#136D55"
        }
    },

    {   
        artist: "idntt",
        season: "Winter26",
        collections: ["222Z", "223Z", "224Z", "225Z"],
        style: {
            text: "#FFCDCD",
            logo: "#FFCDCD"
        }
    },

    {   
        artist: "idntt",
        season: "Winter26",
        collections: ["226Z"],
        style: {
            text: "#3D2E93",
            logo: "#3D2E93"
        }
    },

    {   
        artist: "idntt",
        season: "Winter26",
        collections: ["227Z"],
        style: {
            text: "#FAD400",
            logo: "#FAD400"
        }
    },

    {   
        artist: "idntt",
        season: "Winter26",
        collections: ["230Z", "231Z"],
        style: {
            text: "#A4E1FF",
            logo: "#A4E1FF"
        }
    },

    {   
        artist: "idntt",
        season: "Spring26",
        collections: ["204Z", "205Z", "206Z", "207Z"],
        style: {
            text: "#1C3A08",
            logo: "#1C3A08"
        }
    },

    {   
        artist: "idntt",
        season: "Spring26",
        collections: ["208Z", "209Z"],
        style: {
            text: "#F0FFD0",
            logo: "#F0FFD0"
        }
    },

    {   
        artist: "idntt",
        season: "Spring26",
        collections: ["210Z"],
        style: {
            text: "#966A28",
            logo: "#966A28"
        }
    },

    {   
        artist: "idntt",
        season: "Spring26",
        collections: ["211Z"],
        style: {
            text: "#772151",
            logo: "#772151"
        }
    },

    {   
        artist: "idntt",
        season: "Spring26",
        collections: ["213Z", "214Z"],
        style: {
            text: "#FFA617",
            logo: "#FFA617"
        }
    },

    {   
        artist: "idntt",
        season: "Spring26",
        collections: ["215Z", "216Z", "217Z", "218Z"],
        style: {
            text: "#D6345E",
            logo: "#D6345E"
        }
    },

    {   
        artist: "idntt",
        season: "Summer26",
        collections: ["212Z", "213Z"],
        style: {
            text: "#D6D6D6",
            logo: "#D6D6D6"
        }
    },
];