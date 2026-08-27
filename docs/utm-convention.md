# Quy ước UTM — Quân Kiu Daily

> Dùng khi gắn link blog trên TikTok / Facebook / comment.  
> Mục tiêu: biết traffic vào từ đâu và campaign nào (slug bài) trước khi tối ưu.

## Template

```
?utm_source=<nguồn>&utm_medium=<vị-trí>&utm_campaign=<slug-bài>
```

### Giá trị chuẩn

| Param | Giá trị | Ý nghĩa |
|-------|---------|---------|
| `utm_source` | `tiktok` \| `facebook` \| `zalo` | Nền tảng social |
| `utm_medium` | `bio` \| `comment` \| `story` \| `caption` | Vị trí đặt link |
| `utm_campaign` | slug bài, ví dụ `tiktok-hook-3-giay` | Bài / deal đang đẩy |

## Ví dụ

**Link-in-bio TikTok → trang `/links`:**

```
https://<SITE_URL>/links?utm_source=tiktok&utm_medium=bio&utm_campaign=links
```

**Comment dưới video đẩy bài hook 3 giây:**

```
https://<SITE_URL>/blog/tiktok-hook-3-giay?utm_source=tiktok&utm_medium=comment&utm_campaign=tiktok-hook-3-giay
```

**Từ `/links` sang `/go` (deal):** giữ UTM trên URL `/go` nếu muốn đo click affiliate theo campaign — hoặc chỉ đo session từ bio vào `/links` rồi xem click `/go` trong admin.

## Ghi chú vận hành

- Bio TikTok nên trỏ **`/links`** (không trỏ homepage chung).
- Một video = một `utm_campaign` (slug bài đang đẩy) để so sánh video nào ra session/click.
- Click `/go` cũng log `utm_*` + referrer (sau khi chạy migration `20260827_click_events.sql`).
