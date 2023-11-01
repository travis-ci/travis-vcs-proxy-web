# Make sure we set that before everything
ENV['RACK_ENV'] ||= ENV['RAILS_ENV'] || ENV['ENV']
ENV['RAILS_ENV']  = ENV['RACK_ENV']

$: << 'lib'
require 'travis/web'

class RedirectSubdomain < Struct.new(:app, :from)
  def call(env)
    request = Rack::Request.new(env)
    if request.host == from
      [301, { 'Location' => "https://travis-ci.com#{request.fullpath}", 'Content-Type' => 'text/html' }, []]
    else
      app.call(env)
    end
  end
end

use Travis::Web::ApiRedirect do |app|
  app.settings.api_endpoint = ENV['VCS_PROXY_API_ENDPOINT'] if ENV['VCS_PROXY_API_ENDPOINT']
  app.settings.beta = ENV['VCS_PROXY_BETA'] if ENV['VCS_PROXY_BETA']
end

ENV['VCS_PROXY_API_ENDPOINT'] ||= "http://travis-vcs-proxy.travis-ci.com"
ENV['VCS_PROXY_BETA'] ||= 'false'

ENV['SSH_KEY_ENABLED'] = 'true' unless ENV.has_key?('SSH_KEY_ENABLED')
ENV['CACHES_ENABLED'] = 'true' unless ENV.has_key?('CACHES_ENABLED')

ENV['GA_CODE'] ||= "UA-24868285-5"

run Travis::Web::App.build(
  userlike:        ENV['USERLIKE'],
  environment:     ENV['RACK_ENV'] || 'development',
  api_endpoint:    ENV['VCS_PROXY_API_ENDPOINT'],
  beta:            ENV['VCS_PROXY_BETA'],
  ga_code:         ENV['GA_CODE'],
  root:            File.expand_path('../../app', __FILE__),
  server_start:    Time.now,
  caches_enabled:  ENV['CACHES_ENABLED'],
  ssh_key_enabled: ENV['SSH_KEY_ENABLED'],
  customer_io_site_id: ENV['CUSTOMER_IO_SITE_ID'],
  pro: ENV['TRAVIS_PRO'],
  enterprise: ENV['TRAVIS_ENTERPRISE'],
  public_mode: ENV['PUBLIC_MODE'],
  assets_host: ENV['ASSETS_HOST'],
  ajax_polling: ENV['AJAX_POLLING'],
  enable_feature_flags: ENV['ENABLE_FEATURE_FLAGS'],
)
