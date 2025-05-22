# Use nginx as the base image
FROM nginx:alpine

# Copy the web build files to nginx's default public directory
COPY web-build/ /usr/share/nginx/html/

# Copy our custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 