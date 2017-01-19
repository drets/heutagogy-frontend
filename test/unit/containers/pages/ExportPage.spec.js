import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Immutable from 'immutable';
import { ExportPage } from '../../../../src/containers/pages/ExportPage/ExportPage';
import { ZERO, ONE } from '../../../../src/constants/Constants';

const saveButtonSelector = '#save-button';
const exportButtonSelector = '#export-button';
const meta = 'data:text/plain;charset=utf-8,';


describe('Export page tests', () => {
  let sandbox; //eslint-disable-line

  beforeEach(() => {
    sandbox = sinon.sandbox.create(); //eslint-disable-line
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('“Save” button is disabled by default', () => {
    const wrapper = shallow(<ExportPage articles={Immutable.fromJS([])} />);

    expect(wrapper.find(saveButtonSelector).prop('disabled')).to.equal(true);
  });

  it('“Save” button is enabled when data is imported', () => {
    const wrapper = shallow(<ExportPage articles={Immutable.fromJS([{ url: 'https://github.com/' }])} />);

    expect(wrapper.find(saveButtonSelector).prop('disabled')).to.equal(false);
  });

  it('“Export” button is enabled by default', () => {
    const wrapper = shallow(<ExportPage articles={Immutable.fromJS([])} />);

    expect(wrapper.find(exportButtonSelector).prop('disabled')).to.equal(false);
  });

  it('Table is empty by default', () => {
    const wrapper = shallow(<ExportPage articles={Immutable.fromJS([])} />);

    expect(wrapper.find('td')).to.have.length(ZERO);
  });

  it('Should save selected articles', () => {
    const setAttributeSpy = sandbox.spy();
    const clickSpy = sandbox.spy();

    sandbox.stub(document, 'createElement').withArgs('a').returns({
      setAttribute: setAttributeSpy,
      dispatchEvent: clickSpy,
    });

    const data = [
      {
        url: 'http://example.com/',
        title: 'Example Domain',
        timestamp: '2016-01-01T05:06:07',
        read: null,
      },
      {
        url: 'https://github.com/',
        title: 'How people build software',
        timestamp: '2016-01-02T05:06:08',
        read: '2016-01-03T05:06:08',
      },
      {
        url: 'https://www.google.com.ua',
      },
    ];
    const wrapper = shallow(<ExportPage articles={Immutable.fromJS(data)} />);


    wrapper.setState({ selectedRows: [ONE] });

    wrapper.find(saveButtonSelector).simulate('click');

    expect(setAttributeSpy.getCall(ZERO).args).to.deep.equal([
      'href',
      `${meta}${encodeURIComponent(JSON.stringify([data[ONE]]))}`,
    ]);
    expect(clickSpy.called).to.equal(true);
  });

  it('Should save all articles if all articles are selecteled', () => {
    const setAttributeSpy = sandbox.spy();
    const clickSpy = sandbox.spy();

    sandbox.stub(document, 'createElement').withArgs('a').returns({
      setAttribute: setAttributeSpy,
      dispatchEvent: clickSpy,
    });

    const data = [
      {
        url: 'http://example.com/',
        title: 'Example Domain',
        timestamp: '2016-01-01T05:06:07',
        read: null,
      },
      {
        url: 'https://github.com/',
        title: 'How people build software',
        timestamp: '2016-01-02T05:06:08',
        read: '2016-01-02T09:06:08',
      },
      {
        url: 'https://www.google.com.ua',
      },
    ];
    const wrapper = shallow(<ExportPage articles={Immutable.fromJS(data)} />);


    wrapper.setState({ selectedRows: 'all' });

    wrapper.find(saveButtonSelector).simulate('click');

    expect(setAttributeSpy.getCall(ZERO).args).to.deep.equal([
      'href',
      `${meta}${encodeURIComponent(JSON.stringify(data))}`,
    ]);
    expect(clickSpy.called).to.equal(true);
  });

  it('Shouldn\'t save articles if there are no selected articles', () => {
    const setAttributeSpy = sandbox.spy();
    const clickSpy = sandbox.spy();

    sandbox.stub(document, 'createElement').withArgs('a').returns({
      setAttribute: setAttributeSpy,
      dispatchEvent: clickSpy,
    });

    const data = [
      {
        url: 'http://example.com/',
        title: 'Example Domain',
        timestamp: '2016-01-01T05:06:07',
        read: null,
      },
      {
        url: 'https://github.com/',
        title: 'How people build software',
        timestamp: '2016-01-02T05:06:08',
        read: '2016-01-03T05:06:08',
      },
      {
        url: 'https://www.google.com.ua',
      },
    ];
    const wrapper = shallow(<ExportPage articles={Immutable.fromJS(data)} />);

    wrapper.setState({ selectedRows: [] });

    wrapper.find(saveButtonSelector).simulate('click');

    expect(setAttributeSpy.called).to.equal(false);
    expect(clickSpy.called).to.equal(false);
  });
});
