require 'sinatra'

class Travis::Web::ApiRedirect < Sinatra::Base
  disable :protection, :static
  set api_endpoint: 'https://travis-vcs-proxy.travis-ci.com'
  set redirect_png: ENV['REDIRECT_PNG']
  set beta: false

  class NotPublicImages
    Match = Struct.new(:captures)

    def to_mustermann
      mustermann = Mustermann.new('placegolder')
      mustermann.define_singleton_method(:match) do |str|
        Match.new([]) if str =~ %r{^/([^/]+)/([^/]+)\.(png|svg)$} && str !~ %r{^/images/}
      end
      mustermann
    end
  end

  get NotPublicImages.new.to_mustermann do
    if settings.redirect_png
      redirect!(request.fullpath.gsub(/\.png$/, '.svg'))
    else
      redirect!
    end
  end

  get '/:owner_name/:name/cc.xml' do
    redirect!
  end

  private

    def public_image?
      params[:owner_name] == 'images'
    end

    def redirect!(path = nil)
      path = File.join(settings.api_endpoint, path || request.fullpath)
      redirect(path, 301)
    end
end
