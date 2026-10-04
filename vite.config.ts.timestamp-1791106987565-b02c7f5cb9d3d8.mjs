// vite.config.ts
import { defineConfig } from "file:///D:/New%20folder/node_modules/vite/dist/node/index.js";
import react from "file:///D:/New%20folder/node_modules/@vitejs/plugin-react/dist/index.js";
import { fileURLToPath, URL } from "node:url";
var __vite_injected_original_import_meta_url = "file:///D:/New%20folder/vite.config.ts";
var SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https://images.unsplash.com https://images.pexels.com https://*.supabase.co https://bolt.new",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join("; "),
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
};
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  server: {
    host: "0.0.0.0",
    port: 3e3,
    cors: false,
    // CORS Check: Reject unauthorized cross-origin requests
    headers: SECURITY_HEADERS
  },
  preview: {
    port: 3e3,
    cors: false,
    // CORS Check: Reject unauthorized cross-origin requests
    headers: SECURITY_HEADERS
  },
  optimizeDeps: {
    exclude: ["lucide-react"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxOZXcgZm9sZGVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxOZXcgZm9sZGVyXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9OZXclMjBmb2xkZXIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCc7XG5cbmNvbnN0IFNFQ1VSSVRZX0hFQURFUlMgPSB7XG4gICdYLUNvbnRlbnQtVHlwZS1PcHRpb25zJzogJ25vc25pZmYnLFxuICAnWC1GcmFtZS1PcHRpb25zJzogJ0RFTlknLFxuICAnU3RyaWN0LVRyYW5zcG9ydC1TZWN1cml0eSc6ICdtYXgtYWdlPTMxNTM2MDAwOyBpbmNsdWRlU3ViRG9tYWluczsgcHJlbG9hZCcsXG4gICdDb250ZW50LVNlY3VyaXR5LVBvbGljeSc6IFtcbiAgICBcImRlZmF1bHQtc3JjICdzZWxmJ1wiLFxuICAgIFwic2NyaXB0LXNyYyAnc2VsZicgJ3Vuc2FmZS1pbmxpbmUnXCIsXG4gICAgXCJzdHlsZS1zcmMgJ3NlbGYnICd1bnNhZmUtaW5saW5lJyBodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tXCIsXG4gICAgXCJmb250LXNyYyAnc2VsZicgaHR0cHM6Ly9mb250cy5nc3RhdGljLmNvbSBkYXRhOlwiLFxuICAgIFwiaW1nLXNyYyAnc2VsZicgZGF0YTogYmxvYjogaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tIGh0dHBzOi8vaW1hZ2VzLnBleGVscy5jb20gaHR0cHM6Ly8qLnN1cGFiYXNlLmNvIGh0dHBzOi8vYm9sdC5uZXdcIixcbiAgICBcImNvbm5lY3Qtc3JjICdzZWxmJyBodHRwczovLyouc3VwYWJhc2UuY28gd3NzOi8vKi5zdXBhYmFzZS5jb1wiLFxuICAgIFwiZnJhbWUtYW5jZXN0b3JzICdub25lJ1wiLFxuICAgIFwib2JqZWN0LXNyYyAnbm9uZSdcIixcbiAgICBcImJhc2UtdXJpICdzZWxmJ1wiLFxuICAgIFwiZm9ybS1hY3Rpb24gJ3NlbGYnXCIsXG4gIF0uam9pbignOyAnKSxcbiAgJ1gtWFNTLVByb3RlY3Rpb24nOiAnMTsgbW9kZT1ibG9jaycsXG4gICdSZWZlcnJlci1Qb2xpY3knOiAnc3RyaWN0LW9yaWdpbi13aGVuLWNyb3NzLW9yaWdpbicsXG4gICdQZXJtaXNzaW9ucy1Qb2xpY3knOiAnY2FtZXJhPSgpLCBtaWNyb3Bob25lPSgpLCBnZW9sb2NhdGlvbj0oKScsXG59O1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgIH0sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6ICcwLjAuMC4wJyxcbiAgICBwb3J0OiAzMDAwLFxuICAgIGNvcnM6IGZhbHNlLCAvLyBDT1JTIENoZWNrOiBSZWplY3QgdW5hdXRob3JpemVkIGNyb3NzLW9yaWdpbiByZXF1ZXN0c1xuICAgIGhlYWRlcnM6IFNFQ1VSSVRZX0hFQURFUlMsXG4gIH0sXG4gIHByZXZpZXc6IHtcbiAgICBwb3J0OiAzMDAwLFxuICAgIGNvcnM6IGZhbHNlLCAvLyBDT1JTIENoZWNrOiBSZWplY3QgdW5hdXRob3JpemVkIGNyb3NzLW9yaWdpbiByZXF1ZXN0c1xuICAgIGhlYWRlcnM6IFNFQ1VSSVRZX0hFQURFUlMsXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK04sU0FBUyxvQkFBb0I7QUFDNVAsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZSxXQUFXO0FBRmtHLElBQU0sMkNBQTJDO0FBSXRMLElBQU0sbUJBQW1CO0FBQUEsRUFDdkIsMEJBQTBCO0FBQUEsRUFDMUIsbUJBQW1CO0FBQUEsRUFDbkIsNkJBQTZCO0FBQUEsRUFDN0IsMkJBQTJCO0FBQUEsSUFDekI7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNGLEVBQUUsS0FBSyxJQUFJO0FBQUEsRUFDWCxvQkFBb0I7QUFBQSxFQUNwQixtQkFBbUI7QUFBQSxFQUNuQixzQkFBc0I7QUFDeEI7QUFHQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxJQUN0RDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBLElBQ04sU0FBUztBQUFBLEVBQ1g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBLElBQ04sU0FBUztBQUFBLEVBQ1g7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxjQUFjO0FBQUEsRUFDMUI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
