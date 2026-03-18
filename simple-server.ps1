# Simple HTTP Server in PowerShell
$port = 9000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Server started at http://localhost:$port/"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $path = $request.Url.LocalPath
        if ($path -eq "/") {
            $path = "/index.html"
        }
        
        $filePath = Join-Path -Path "." -ChildPath $path.TrimStart("/")
        
        if (Test-Path -Path $filePath -PathType Leaf) {
            # Set MIME type
            $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
            switch ($extension) {
                ".html" { $response.ContentType = "text/html" }
                ".css" { $response.ContentType = "text/css" }
                ".js" { $response.ContentType = "application/javascript" }
                ".jpg" { $response.ContentType = "image/jpeg" }
                ".jpeg" { $response.ContentType = "image/jpeg" }
                ".png" { $response.ContentType = "image/png" }
                ".gif" { $response.ContentType = "image/gif" }
                default { $response.ContentType = "application/octet-stream" }
            }
            
            # Read and send file
            if ($extension -match '\.(jpg|jpeg|png|gif)$') {
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $content = Get-Content -Path $filePath -Raw
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($content)
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
        } else {
            $response.StatusCode = 404
            $content = "File not found"
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($content)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        
        $response.Close()
    } catch {
        Write-Host "Error: $($_.Exception.Message)"
    }
}

$listener.Stop()
$listener.Close()