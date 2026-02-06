const prizes = [
	{ title: 'Giải Đặc Biệt', name: 'IPAD 11 M3 WiFi 128GB' },
	{ title: 'Giải Nhất', name: 'Máy lọc không khí PHILIPS' },
	{ title: 'Giải Nhất', name: 'Máy hút bụi cầm tay DREAME PRO' },
	{ title: 'Giải Nhì', name: 'Nồi chiên không dầu PHILIPS' },
	{ title: 'Giải Nhì', name: 'Apple Airpods 4' },
	{ title: 'Giải Nhì', name: 'Loa Marshall Emberton II' },
	{ title: 'Giải Ba', name: 'Bàn chải điện ORAL-B' },
	{ title: 'Giải Ba', name: 'Nồi lẩu BEAR' },
	{ title: 'Giải Ba', name: 'Máy sấy tóc DREAME' },
	{ title: 'Giải Ba', name: 'Máy chiếu EROC MAGIC ULTRA' },
];

export const PRIZES_DATA = prizes.map((prize, i) => ({
	...prize,
	imageUrl: `/images/prizes/${i + 1}.png`,
}));
