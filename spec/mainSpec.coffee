'use strict'
describe 'test', ->
  $httpBackend = undefined
  beforeEach module('rabbit')
  beforeEach inject((_$httpBackend_, _user_) -># {{{
    (user, $httpBackend ) = (_user_, _$httpBackend_)
    database = 'http://www40.atpages.jp/chatblanc/genderC/database.php'
    $httpBackend.whenPOST(database, "type=permission&groupID=&userID=#{user.id}").respond '[]'
    $httpBackend.whenPOST(database, (s) ->
      s.indexOf('type=list') != -1
    ).respond '[{"name":"\\"test group\\"","event":"[]","habit":"[]","id":"1"}]'
    $httpBackend.whenPOST(database, (s) ->
      s.indexOf('id=2') != -1
    ).respond 201, ''
    $httpBackend.whenPOST(database, 'type=namelist').respond '[["\\"test group\\"","\\"test group2\\""]]'
    return
  )# }}}
  describe 'execSelector()', -># {{{
    (year, month, f, calendar, OVER_MONTH, execSelectors)=undefined

    beforeEach inject((_calendar_, _OVER_MONTH_) ->
      (calendar, OVER_MONTH) = (_calendar_, _OVER_MONTH_)
      execSelectors = calendar.execSelectors
      # selectors list:'date', 'day', 'is', 'month', 'not', 'range', 'year', 'yesterday'
      year = 2012
      month = 2 - 1
      # 2012/2
      return
    )
    it 'date selector', ->
      expect(execSelectors('date:3', year, month)).toEqual [ 3 ]
      expect(execSelectors('date:vernal-equinox-day', year, 2)).toEqual [ 20 ]
      expect(execSelectors('date:autumnal-equinox-day', year, 8)).toEqual [ 22 ]
      expect(execSelectors('date:full-moon-night', year, 8)).toEqual [ 30 ]
      return
    it 'day selector', ->
      expect(execSelectors('day:wed', year, month)).toEqual [1, 8, 15, 22, 29]
      expect(execSelectors('day:2nd-wed', year, month)).toEqual [ 8 ]
      expect(execSelectors('day:last-wed', year, month)).toEqual [ 29 ]
      return
    it 'is selector', ->
      expect(execSelectors('is:public-holiday', year, month)).toEqual [ 11 ]
      return
    it 'month selector', ->
      all_days = calendar.calendar(year, month, true)
      expect(execSelectors('month:2', year, month)).toEqual all_days
      expect(execSelectors('month:3', year, month)).toEqual []
      return
    it 'range selector', ->
      expect(execSelectors("range:#{year}/2/11..#{year}/2/14", year, month)).toEqual [11, 12, 13, 14]#range:y/m/d...y/m/d
      expect(execSelectors("range:#{year+1}/2/11..#{year+1}/2/14", year, month)).toEqual []#range:y/m/d...y/m/d
      expect(execSelectors('range:2/11...2/14', year, month)).toEqual [11, 12, 13, 14]
      expect(execSelectors('range:2/11..2/14', year, month)).toEqual [11, 12, 13, 14]
      expect(execSelectors('range:12/29...1/3', year, 12 - 1)).toEqual [29, 30, 31]
      expect(execSelectors('range:12/29...1/3', year, 1 - 1)).toEqual [1, 2, 3]
      return
    it 'year selector', ->
      all_days = calendar.calendar(year, month, true)
      expect(execSelectors("year:#{year+1}", year, month)).toEqual []
      expect(execSelectors("year:#{year}", year, month)).toEqual all_days
      expect(execSelectors('year:leap-year', year, month)).toEqual all_days
      expect(execSelectors('year:leap-year', year + 1, month)).toEqual []
      return
    it 'yesterday selector', ->
      expect(execSelectors('yesterday:date:4', year, month)).toEqual [ 5 ]
      return
    return# }}}
  describe 'splitSelector()', -># {{{
    (OPERATOR, OTHERS, LPARENTHESES, RPARENTHESES, calendar)=undefined

    beforeEach inject((_calendar_, _ATTRIBUTE_) ->
      {OPERATOR, OTHERS, LPARENTHESES, RPARENTHESES}=_ATTRIBUTE_
      calendar = _calendar_
      return
    )
    it 'should attach OTHERS to "key:value"', ->
      expect(calendar.splitSelector('key:value')).toEqual [ ['key:value',OTHERS] ]
      return
    it 'should attach OPERATOR to "and"', ->
      expect(calendar.splitSelector('key:value かつ key:value')).toEqual [ [ 'key:value', OTHERS ], [ '&&', OPERATOR ], [ 'key:value', OTHERS ] ]
      expect(calendar.splitSelector('key:value && key:value')).toEqual [ [ 'key:value', OTHERS ], [ '&&', OPERATOR ], [ 'key:value', OTHERS ] ]
      expect(calendar.splitSelector('key:value and key:value')).toEqual [ [ 'key:value', OTHERS ], [ '&&', OPERATOR ], [ 'key:value', OTHERS ] ]
      expect(calendar.splitSelector('key:value key:value')).toEqual [ [ 'key:value', OTHERS ], [ '&&', OPERATOR ], [ 'key:value', OTHERS ] ]
      return
    it 'should attach OPERATOR to "or"', ->
      expect(calendar.splitSelector('key:value または key:value')).toEqual [ [ 'key:value', OTHERS ], [ '||', OPERATOR ], [ 'key:value', OTHERS ] ]
      expect(calendar.splitSelector('key:value || key:value')).toEqual [ [ 'key:value', OTHERS ], [ '||', OPERATOR ], [ 'key:value', OTHERS ] ]
      expect(calendar.splitSelector('key:value or key:value')).toEqual [ [ 'key:value', OTHERS ], [ '||', OPERATOR ], [ 'key:value', OTHERS ] ]
      return
    it 'should attach LPARENTHESES to "(" and attach RPARENTHESES to ")"', ->
      expect(calendar.splitSelector('(key:value and key:value) and key:value')).toEqual [ [ '(', LPARENTHESES ], [ 'key:value', OTHERS ], [ '&&', OPERATOR ], [ 'key:value', OTHERS ], [ ')', RPARENTHESES ], [ '&&', OPERATOR ], [ 'key:value', OTHERS ] ]
      return
    return# }}}
  describe 'calendar.calendar()', -># {{{
    it 'should be real calendar.', inject((calendar, OVER_MONTH) ->
      expect(JSON.stringify(calendar.calendar(2014, 2 - 1))).toEqual JSON.stringify([
        [ 0, 0, 0, 0, 0, 0, 1 ]
        [2..8]
        [9..15]
        [16..22]
        [ 23, 24, 25, 26, 27, 28, OVER_MONTH ]
      ])
      expect(_.flatten(calendar.calendar(2014, 2 - 1))).toEqual [ 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, OVER_MONTH ]
      expect(calendar.calendar(2014, 2 - 1, true)).toEqual [1..28]
      return
    )
    return# }}}
  describe 'switchToEdit()', -># {{{
    (mode, eventForm, group)=undefined

    beforeEach inject((_mode_, _eventForm_, _group_) ->
      (mode, eventForm, group ) = (_mode_, _eventForm_, _group_ )
      group[0].event = [ {
        year: 2015
        month: 1
        date: 14
        name: '[mes]バレンタイン'
      } ]
      return
    )
    it 'should initialize eventForm correctly when switching to edit with add mode with date.', ->
      mode.switchToEdit 2015, 2 - 1, 14
      expect(eventForm).toEqual
        name: ''
        year: 2015
        month: 2
        date: 14
        type: 'event'
        rule: ''
        mode: 'add'
        id: 0
      return
    it 'should initialize eventForm correctly when switching to edit mode with edit event mode.', ->
      mode.switchToEdit '0:0:event'
      expect(eventForm).toEqual
        name: group[0].event[0].name.replace(/^\[mes\]/, '')
        year: group[0].event[0].year
        month: group[0].event[0].month + 1
        date: group[0].event[0].date
        type: 'event'
        rule: ''
        mode: 'edit'
        id: 0
        selectedGroup: 0
        isMessage: true
      return
    it 'should initialize eventForm correctly when switching to edit mode with edit event mode.', ->
      mode.switchToEdit '0:0:event', true
      expect(eventForm).toEqual
        name: group[0].event[0].name.replace(/^\[mes\]/, '')
        year: group[0].event[0].year
        month: group[0].event[0].month + 1
        date: group[0].event[0].date
        type: 'event'
        rule: ''
        mode: 'add'
        id: 0
        selectedGroup: 0
        isMessage: true
      return
    return# }}}
  describe 'add group', -># {{{
    (settingScope, groupScope, SettingCtrl, GroupEditorCtrl)=(undefined,undefined,undefined,undefined)

    beforeEach inject(($controller, $rootScope, user) ->

      settingScope = $rootScope.$new()
      SettingCtrl = $controller('settingCtrl', $scope: settingScope)

      groupScope = $rootScope.$new()
      GroupEditorCtrl = $controller('groupEditorCtrl', $scope: groupScope)
      return
    )
    it 'start group making.', inject((mode, _groupForm_, group) ->
      groupForm = _groupForm_
      $httpBackend.flush()
      expect(group.length).toBe 2
      settingScope.makeGroup()

      expect(mode.editsGroup).toBe true
      groupForm.name = 'hoge'
      groupScope.addGroup()

      expect(group.length).toBe 3
      expect(group[2].name).toBe 'hoge'
      return
    )
    return# }}}
  describe 'directive', -># {{{
    describe 'appDate', ->
      ($compile, $rootScope, calendar)=(undefined,undefined,undefined)
      beforeEach inject((_$compile_, _$rootScope_, _calendar_) ->
        ($compile, $rootScope, calendar ) = (_$compile_, _$rootScope_, _calendar_)
        calendar.selected = 21
        calendar.year = 2015
        calendar.month = 2 - 1
        calendar.date = 14
        calendar.today =
          year: 2015
          month: 2 - 1
          date: 14
        return
      )
      it 'select', ->
        element = $compile('<span app-date="0" app-row="[1,2,3,4,5,6,7]"></span>')($rootScope)
        $rootScope.$digest()
        expect(element.text()).toBe '1'
        expect(element.attr('class').split(' ')).not.toContain 'selected'
        element.triggerHandler 'click'
        expect(element.attr('class').split(' ')).toContain 'selected'
        return
      return
    return# }}}
  return
