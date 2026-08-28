# 戏台图片压缩 v2：内存流读取（避免 FromFile 文件锁），1600px(q80) 原址覆盖 + 600px(q75) 缩略图
Add-Type -AssemblyName System.Drawing

$srcDir = "apps\web\public\assets\map\stage-images"
$backupDir = "原图备份_stage-images"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

function Resize-Jpeg($src, $dst, $maxW, $quality) {
  # 内存流读取：不锁源文件，可覆盖保存同一路径
  $fs = [System.IO.File]::OpenRead($src)
  $ms = New-Object System.IO.MemoryStream
  $fs.CopyTo($ms)
  $fs.Close()
  $ms.Position = 0
  $img = [System.Drawing.Image]::FromStream($ms)
  $w = $img.Width; $h = $img.Height
  if ($w -gt $maxW) { $h = [int]($h * $maxW / $w); $w = $maxW }
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.DrawImage($img, 0, 0, $w, $h)
  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
  $enc = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $enc.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$quality)
  $bmp.Save($dst, $codec, $enc)
  $g.Dispose(); $bmp.Dispose(); $img.Dispose(); $ms.Dispose()
}

$ok = 0; $fail = 0
Get-ChildItem $srcDir -Filter *.jpg | Where-Object { $_.Name -notlike 'thumb-*' } | ForEach-Object {
  $name = $_.Name
  $bak = Join-Path $backupDir $name
  if (-not (Test-Path $bak)) { Copy-Item $_.FullName $bak -Force }
  try {
    Resize-Jpeg $_.FullName $_.FullName 1600 80        # 原址覆盖 1600
    Resize-Jpeg $_.FullName (Join-Path $srcDir "thumb-$name") 600 75  # 缩略图
    $ok++
  } catch {
    $fail++; Write-Output "失败: $name - $($_.Exception.Message)"
  }
}
Write-Output "成功: $ok / 失败: $fail"
$files = Get-ChildItem $srcDir -File
Write-Output "压缩后合计: $([math]::Round(($files | Measure-Object Length -Sum).Sum/1MB,1)) MB ($($files.Count) 文件)"
Get-ChildItem $srcDir -Filter *.jpg | Where-Object { $_.Name -notlike 'thumb-*' } | Sort-Object Length -Descending | Select-Object -First 3 Name, @{N='KB';E={[math]::Round($_.Length/1KB)}} | Format-Table -AutoSize
