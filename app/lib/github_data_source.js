require('dashboard/core');

Dashboard.GitHubDataSource = DS.Adapter.extend({
  PREFIX: 'https://api.github.com',
  
  ajax: function(url, target, callback) {
    Ember.$.ajax({
      url: this.PREFIX + url,
      dataType: 'jsonp',
      context: this,
      success: function(data) {
        this._ajaxSuccess(data, target, callback);
      }
    });
  },
  
  _ajaxSuccess: function(response, target, callback) {
    this._updateLimits(response);
    if (Ember.typeOf(target) === 'function') {
      target.apply(this, [response.data]);
    } else {
      Ember.tryInvoke(target, callback, [response.data]);
    }
  },
  
  _updateLimits: function(response) {
    if (response.meta) {
      this.set('remaining', response.meta['X-RateLimit-Remaining']);
      this.set('limit', response.meta['X-RateLimit-Limit']);
    }
  },
  
  watchedRepositories: function(username, target, callback) {
    this.ajax('/users/%@/watched'.fmt(username), target, callback);
  }
});