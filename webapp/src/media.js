export default {
    getRandomThumbnail,
}

function getRandomThumbnail() {
    const thumbs = [
        "/images/trending/trending-5.jpg",
        "/images/trending/trending-6.jpg",
        "/images/trending/trending-7.jpg",
        "/images/trending/trending-8.jpg",
        "/images/instagram/ip-1.jpg",
        "/images/instagram/ip-2.jpg",
        "/images/instagram/ip-3.jpg",
        "/images/instagram/ip-4.jpg",
    ]

    const min = 0
    const max = thumbs.length - 1

    const rand = Math.floor(Math.random() * (max - min + 1) + min);

    return thumbs[rand]
}
