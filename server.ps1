$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8888/')
$listener.Start()
Write-Host 'Listening on http://localhost:8888/'

while ($true) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $path = $request.Url.LocalPath
        
        if ($path -eq '/') {
            $path = '/index.html'
        }
        
        $filePath = Join-Path -Path '.' -ChildPath $path.TrimStart('/')
        
        if (Test-Path -Path $filePath -PathType Leaf) {
            # Set MIME type based on file extension
            $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
            
            switch ($extension) {
                '.html' { $response.ContentType = 'text/html' }
                '.css' { $response.ContentType = 'text/css' }
                '.js' { $response.ContentType = 'application/javascript' }
                '.jpg' { $response.ContentType = 'image/jpeg' }
                '.jpeg' { $response.ContentType = 'image/jpeg' }
                '.png' { $response.ContentType = 'image/png' }
                '.gif' { $response.ContentType = 'image/gif' }
                default { $response.ContentType = 'application/octet-stream' }
            }
            
            if ($extension -match '\.(jpg|jpeg|png|gif)$') {
                # For binary files, read as byte array
                $content = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentLength64 = $content.Length
                $response.OutputStream.Write($content, 0, $content.Length)
            } else {
                # For text files, read as string
                $content = Get-Content -Path $filePath -Raw
                $contentBytes = [System.Text.Encoding]::UTF8.GetBytes($content)
                $response.ContentLength64 = $contentBytes.Length
                $response.OutputStream.Write($contentBytes, 0, $contentBytes.Length)
            }
        } else {
            $response.StatusCode = 404
        }
        
        $response.Close()
    } catch {
        Write-Host "Error: $($_.Exception.Message)"
    }
}