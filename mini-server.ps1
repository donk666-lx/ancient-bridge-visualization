# Mini HTTP Server
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:10002/')
try {
    $listener.Start()
    Write-Host "Server running at http://localhost:10002/"
    
    while ($true) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $path = $request.Url.LocalPath
        if ($path -eq '/') {
            $path = '/index.html'
        }
        
        $filePath = Join-Path -Path '.' -ChildPath $path.TrimStart('/')
        
        if (Test-Path -Path $filePath -PathType Leaf) {
            $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
            
            switch ($extension) {
                '.html' { $response.ContentType = 'text/html' }
                '.css' { $response.ContentType = 'text/css' }
                '.js' { $response.ContentType = 'application/javascript' }
                '.jpg' { $response.ContentType = 'image/jpeg' }
                '.jpeg' { $response.ContentType = 'image/jpeg' }
                '.png' { $response.ContentType = 'image/png' }
                default { $response.ContentType = 'application/octet-stream' }
            }
            
            $stream = [System.IO.File]::OpenRead($filePath)
            $buffer = New-Object byte[] 1024
            $bytesRead = 0
            
            while (($bytesRead = $stream.Read($buffer, 0, $buffer.Length)) -gt 0) {
                $response.OutputStream.Write($buffer, 0, $bytesRead)
            }
            
            $stream.Close()
        } else {
            $response.StatusCode = 404
            $content = [System.Text.Encoding]::UTF8.GetBytes('File not found')
            $response.OutputStream.Write($content, 0, $content.Length)
        }
        
        $response.Close()
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
} finally {
    $listener.Stop()
    $listener.Close()
}