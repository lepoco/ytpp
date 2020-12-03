![Logo](https://github.com/rapiddev/ytpp/blob/main/.github/screenshot-1.jpg?raw=true)
# YouTube Playlist Player
[![](https://data.jsdelivr.com/v1/package/gh/rapiddev/ytpp/badge)](https://www.jsdelivr.com/package/gh/rapiddev/ytpp)  
[Created with ![heart](http://i.imgur.com/oXJmdtz.gif) in Poland by RapidDev](https://rdev.cc/)<br />
A simple way to display playlists nicely on your website. Reponsively, using YT API V3.  
This is an early version so there is still room for improvement.

## Usage
**Add a reference to the script and style**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rapiddev/ytpp@1.0.0/src/css/ytpp.css" integrity="sha256-hMW50Vg738LsinpIrYMParfnb67/dLwMFAXyJtE/RSs=" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/gh/rapiddev/ytpp@1.0.0/src/js/ytpp.js" integrity="sha256-sz9cQUoYLqwwM6g55M2vgTnAxtl3efCZOEysQuq8+Bw=" crossorigin="anonymous"></script>
```

**Place the player wherever you like**
```html
<div class="ytpp-player"
  data-playlist="PLpsBoYnu3xNbKE_i7crf55E8h7lgHp4bt"
  data-format="2by1"
  data-itemsheight="50"
  data-itemswidth="90"
  data-rounded="true"
  data-loop="true"
  data-autoplay="true"
  data-playnext="true"
  data-showcontrols="false"
  data-showtitles="false"
  data-showinfo="false"
  data-showrelated="false">
</div>
```

**Finally, run the script**
```html
<script>
  new YTPP( { api: 'your_youtube_api_v3_key' } ).Show();
</script>
```

## Global arguments
You can change the settings for all players during script initialization  

```html
<script>
  new YTPP(
  {
    debug: true,
    itemsHeight: 50,
    itemsWidth: 90,
    api: 'your_youtube_api_v3_key',
    show:
    {
      controls: true,
      related: false
    }
  }).Show();
</script>
```

## Options available
| Option | Description |
| --- | --- | 
| **api** | Your private YouTube API V3 key<br/>Default: **''** |
| **playlist** | Playlist embed ID<br/>Default: **''** |
| **format*** | The aspect ratio of movies in your playlist<br/>Available: **16by9, 21by9, 2by1**<br/>Default: **'16by9'** |
| **itemsheight*** | The height of a single element in the slider.<br/>Default: **70** (px) |
| **itemswidth*** | The width of a single element in the slider.<br/>Default: **110** (px) |
| **container*** | The HTML element that the player will be placed in<br/>Default: **null** |
| **rounded*** | Adds rounded edges to the player and carousel items<br/>Default: **true** |
| **playnext*** | Automatically play next videos<br/>Default: **true** |
| **autoplay*** | Start playback automatically<br/>Default: **false** |
| **showcontrols*** | Show interface elements like play and next buttons<br/>Default: **false** |
| **showtitles*** | Show videos titles below thumbnails<br/>Default: **false** |
| **showinfo*** | Setting this parameter to FALSE causes the Player to not show information such as the movie title or uploader name before the movie starts.<br/>Default: **false** |
| **showrelated*** | This parameter determines whether the player should show similar movies after the video has finished playing.<br/>Default: **false** |
| **loop*** | After the entire playlist has played, the player will skip back to the first video and start over.<br/>Default: **false** |
| **debug*** | It displays a lot of information. Do not use in production.<br/>Default: **false** |

*optional
