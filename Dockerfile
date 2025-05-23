# Use an official lightweight web server image
FROM nginxalpine

# Remove default nginx website
RUN rm -rf usrsharenginxhtml

# Copy the exported web build into nginx's public folder
COPY dist usrsharenginxhtml

# Expose port 8888
EXPOSE 8888

# Change nginx default listen port to 8888
RUN sed -i 'slisten       80;listen       8888;g' etcnginxconf.ddefault.conf

# Start nginx in foreground (default command)
CMD [nginx, -g, daemon off;]
