require 'rubygems'
require 'sinatra'

get '/albums' do
  content_type 'application/json'
  send_file 'public/albums.json'
end
